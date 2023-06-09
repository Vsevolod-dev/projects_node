import { Request, Response } from "express";
import Project from "../sequelize/models/project";
import Image from "../sequelize/models/image";
import Tag from "../sequelize/models/tag";
import { CreateProjectRequest, CustomJwtPayload, CustomRequest } from "../types";
import sequelize from "../sequelize";
import jwt from "jsonwebtoken";
import User from "../sequelize/models/user";
import { Op } from "sequelize";


export const getAllProjects = async (req: Request, res: Response) => {
    const {title, description, url, tags} = req.query

    const filtering = []

    if (title) {
        filtering.push({
            title: {
              [Op.substring]: title
            }
        })
    }

    if (description) {
        filtering.push({
            description: {
              [Op.substring]: description
            }
        })
    }

    if (url) {
        filtering.push({
            url: {
              [Op.substring]: url
            }
        })
    }

    if (tags) {
        filtering
    }

    let where: {
        [Op.or]?: {}, 
        '$tags.id$'?: []
    } = {}

    if (filtering.length) {
        where = {
            [Op.or]: filtering
        }
    }

    if (tags) {
        if (where[Op.or]) {
            where['$tags.id$'] = tags as []
        } else {
            where = {
                '$tags.id$': tags as []
            }
        }
    }

    const projects = await Project.findAll({
        where,
        include: [
            {
                model: Image,
                attributes: ['path', 'order']
            },
            {
                model: Tag,
                attributes: []
            }
        ]
    })

    projects.forEach((project) => {
        const images = project.getDataValue('images')

        if (images) {
            const image = images.find(image => image.order === 0)
            if (image && image['path']) {
                project.setDataValue('image', image['path'])
            } else if (images[0] && images[0]['path']) { // if images without order, get first image
                project.setDataValue('image', images[0]['path'])
            }
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
            attributes: ['id', 'name', 'path', 'size', 'desc'],
        },
        {
            model: Tag,
            attributes: ['id', 'title'],
            through: {attributes: []} // removes junction table
        },
        {
            model: User,
            attributes: ['id', 'name', 'email', 'job']
        }],
        order: [
            [ Image, 'order', 'ASC' ]
        ]
    })

    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY!) as CustomJwtPayload;
            res.header('user_by_token', data.userId.toString())
        } catch (e) {
            
        }
    }

    project ? res.json(project) : res.status(404).json({message: 'Project is not found'})
}

export const createProject = async (req: Request, res: Response) => {
    let { title, description, url, tags: tagsIds, images: requestImages }: CreateProjectRequest = req.body
    let userId = parseInt((req as CustomRequest).userId)

    const transaction = await sequelize.transaction()

    try {
        const project = await Project.create({
            title, description, url, user_id: userId
        }, {transaction})

        if (tagsIds) {
            const tags = await Tag.findAll({
                where: {
                    id: tagsIds
                }
            })

            tagsIds = tags.map((tag: Tag) => tag.id)
            await project.setTags(tagsIds, {transaction})
        }
    
        if (requestImages) {
            const images = await Image.findAll({
                where: {
                    path: requestImages.map(ri => ri.path)
                }
            })

            images.forEach(async (image) => {
                const id = requestImages.findIndex(ri => ri.path === image.path)
                await image.update({project_id: project.id, order: id, desc: requestImages[id]?.desc})
            })
        }
    
        await transaction.commit();
        res.send({message: 'Creating successfully', project})
    } catch (e) {
        await transaction.rollback()
        res.status(500).send({message: 'Creating error', error: e})
    }
}

export const updateProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params
    // let { title, description, url, tags: tagsIds, images: imagesPath} = req.body
    let { title, description, url, tags: tagsIds, images: requestImages }: CreateProjectRequest = req.body

    const transaction = await sequelize.transaction()

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
            await transaction.commit()
            res.status(404).send({message: 'Project is not found'})
            return
        }

        await project.update({
            title, description, url
        }, { transaction })

        if (tagsIds) {
            const tags = await Tag.findAll({
                where: {
                    id: tagsIds
                }
            })

            tagsIds = tags.map((tag: Tag) => tag.id)
            await project.setTags(tagsIds, { transaction })
        }

        if (requestImages) {
            const images = await Image.findAll({
                where: {
                    path: requestImages.map(ri => ri.path)
                }
            })

            if (project.images) {
                // removes old images from project
                project.images.forEach(async (image) => {
                    if (!requestImages.find(ri => ri.path === image.path)) {
                        await Image.update({
                            project_id: null
                        },
                        {
                            where: {
                                path: image.path
                            },
                            transaction
                        })
                    }
                })
            }

            images.forEach(async (image) => {
                const id = requestImages.findIndex(ri => ri.path === image.path)
                await image.update({project_id: project.id, order: id, desc: requestImages[id]?.desc}, { transaction })
            })
        }


        await project.reload()
        await transaction.commit()
        res.send({project: project, message: 'Updating successfully'})
    } catch (e) {
        await transaction.rollback()
        res.status(500).send({message: 'Updating error', error: e})
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params

    const transaction = await sequelize.transaction()
    try {
        Project.destroy({
            where: {
                id: projectId
            },
            transaction
        })

        await transaction.commit()
        res.send({message: "Deleting successfully"})
    } catch (e) {
        await transaction.rollback()
        res.status(500).send({message: "Deleting error", error: e})
    }
}

export const getTags = async (req: Request, res: Response) => {
    const tags = await Tag.findAll()
    res.json(tags)
}
