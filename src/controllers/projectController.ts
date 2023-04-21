import { Request, Response } from "express";
import Project from "../sequelize/models/project";
import Image from "../sequelize/models/image";
import Tag from "../sequelize/models/tag";
import { CustomRequest } from "../types";
import sequelize from "../sequelize";
import ProjectTag from "../sequelize/models/projectTag";


// TODO: validations
export const getAllProjects = async (req: Request, res: Response) => {
    const projects = await Project.findAll()
    res.json(projects)
}

export const getProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params

    const project = await Project.findByPk(projectId, {
        attributes: ['id', 'title', 'description', 'url', 'user_id'],
        include: [{
            model: Image,
            attributes: ['id', 'name', 'path'],
        },
        {
            model: Tag,
            attributes: ['id', 'title'],
            through: {attributes: []} // removes junction table
        }]
    })

    const tags = await project?.getTags()
    res.json(project)
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
