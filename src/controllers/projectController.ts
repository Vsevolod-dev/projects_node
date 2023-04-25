import { Request, Response } from "express";
import Project from "../sequelize/models/project";
import Image from "../sequelize/models/image";
import Tag from "../sequelize/models/tag";
import { CustomJwtPayload, CustomRequest } from "../types";
import sequelize from "../sequelize";
import jwt from "jsonwebtoken";
import User from "../sequelize/models/user";


// TODO: validations
export const getAllProjects = async (req: Request, res: Response) => {
    const projects = await Project.findAll({
        include: [{
            model: Image,
            attributes: ['path'],
            limit: 1,
        }]
    })

    projects.forEach(project => {
        const images = project.getDataValue('images')
        if (images && images[0] && images[0]['path']){
            project.setDataValue('image', images[0]['path'])
        }
    })

    res.json(projects)
}

export const getProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params

    const project = await Project.findByPk(projectId, {
        attributes: ['id', 'title', 'description', 'url', 'user_id'],
        include: [{
            model: Image,
            attributes: ['id', 'name', 'path', 'size'],
        },
        {
            model: Tag,
            attributes: ['id', 'title'],
            through: {attributes: []} // removes junction table
        },
        {
            model: User,
            attributes: ['id', 'name', 'email', 'job']
        }]
    })

    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
        const data = jwt.verify(token, process.env.SECRET_KEY!) as CustomJwtPayload;
        res.header('user_by_token', data.userId.toString())
    }

    project ? res.json(project) : res.status(404).json({message: 'Project is not found'})
}

export const createProject = async (req: Request, res: Response) => {
    let { title, description, url, tags: tagsIds, images: imagesPath } = req.body
    let userId = (req as CustomRequest).userId

    const t = await sequelize.transaction()

    try {
        const project = await Project.create({
            title, description, url, user_id: userId
        }, {transaction: t})

        if (tagsIds) {
            const tags = await Tag.findAll({
                where: {
                    id: tagsIds
                }
            })

            tagsIds = tags.map((tag: Tag) => tag.id)
            await project.setTags(tagsIds, {transaction: t})
        }
    
        if (imagesPath) {
            const images = await Image.findAll({
                where: {
                    path: imagesPath
                }
            })

            images.forEach(async (image) => {
                await image.update({project_id: project.id}, {transaction: t})
            })
        }
    
        await t.commit();
        res.send({message: 'Creating successfully'})
    } catch (e) {
        await t.rollback()
        res.status(500).send({message: 'Creating error', error: e})
    }
}

export const updateProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params
    let { title, description, url, tags: tagsIds, images: imagesPath} = req.body

    const t = await sequelize.transaction()

    try {
        const project = await Project.findOne({
            where: { 
                id: projectId 
            },
            include: [
                {
                    model: Image, attributes: ['id', 'name', 'path']
                },
                {
                    model: Tag, attributes: ['id', 'title'], through: { attributes: [] }
                }
            ]
        })

        if (!project) {
            res.status(404).send({message: 'Project is not found'})
            return
        }

        await project.update({
            title, description, url
        }, { transaction: t })

        if (tagsIds) {
            const tags = await Tag.findAll({
                where: {
                    id: tagsIds
                }
            })

            tagsIds = tags.map((tag: Tag) => tag.id)
            await project.setTags(tagsIds, { transaction: t })
        }

        if (imagesPath) {
            const images = await Image.findAll({
                where: {
                    path: imagesPath
                }
            })

            if (project.images) {
                // removes old images from project
                project.images.forEach(async (image) => {
                    if (!imagesPath.includes(image.path)) {
                        await Image.update({
                            project_id: null
                        },
                        {
                            where: {
                                path: image.path
                            },
                            transaction: t
                        })
                    }
                })
            }

            images.forEach(async (image) => {
                await image.update({project_id: project.id}, { transaction: t })
            })
        }


        await project.reload()
        await t.commit()
        res.send({project: project, message: 'Updating successfully'})
    } catch (e) {
        await t.rollback()
        res.status(500).send({message: 'Updating error', error: e})
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params

    const t = await sequelize.transaction()
    try {
        Project.destroy({
            where: {
                id: projectId
            },
            transaction: t
        })

        await t.commit()
        res.send({message: "Deleting successfully"})
    } catch (e) {
        await t.rollback()
        res.status(500).send({message: "Deleting error", error: e})
    }
}

export const getTags = async (req: Request, res: Response) => {
    const tags = await Tag.findAll()
    res.json(tags)
}
