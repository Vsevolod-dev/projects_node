import { Request, Response } from "express";
import Project from "../sequelize/models/project";
import Image from "../sequelize/models/image";
import Tag from "../sequelize/models/tag";


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
            attributes: ['id', 'name', 'path', 'size', 'extension', 'project_id'],
        },
        {
            model: Tag,
            attributes: ['id', 'title']
        }]
    })

    // const tags = await project?.getTags()
    res.json(project)
}

export const createProject = async (req: Request, res: Response) => {
    const { title, description, url, tags: tagsIds, images } = req.body

    const promises = tagsIds.map(async (tag_id: number) => {
        const tag = await Tag.findByPk(tag_id)
        if (tag) {
            return tag.id
        } else {
            return false
        }
    });

    // TODO: add image attaching
    Promise.all(promises).then(async (tagsIds) => {
        tagsIds = tagsIds.filter(tagsIds => tagsIds !== false)
        const project = await Project.create({
            title, description, url, user_id: 2
        }, { include: Tag })
        project.addTags(tagsIds)
        res.send('sucess')
     })
}

export const updateProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params
    const { title, description, url, tags: tagsIds, images} = req.body

    const project = await Project.update({
        title, description, url
    }, {
        where: { 
            id: projectId 
        }
    })

    res.json(project)
}

export const deleteProject = async (req: Request, res: Response) => {
    const { id: projectId } = req.params

    Project.destroy({where: {
        id: projectId
    }})

    res.send('deleted')
}
