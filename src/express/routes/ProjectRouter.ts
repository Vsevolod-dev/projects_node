import express, { Request, Response, NextFunction } from 'express';
import Project from '../../sequelize/models/project';
import Image from '../../sequelize/models/image';
import Tag from '../../sequelize/models/tag';
const router = express.Router()


router.get('/', async (req: Request, res: Response) => { // all projects
    const projects = await Project.findAll()
    res.json(projects)
})

router.get('/:id', async (req, res) => { // projects/:id
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
})

router.post('/', async (req, res) => { // projects/
    const { title, description, url, tags: tagsIds, images } = req.body

    const promises = tagsIds.map(async (tag_id: number) => {
        const tag = await Tag.findByPk(tag_id)
        if (tag) {
            return tag.id
        } else {
            return false
        }
    });

    Promise.all(promises).then(async (tagsIds) => {
        tagsIds = tagsIds.filter(tagsIds => tagsIds !== false)
        const project = await Project.create({
            title, description, url, user_id: 2
        }, { include: Tag })
        project.addTags(tagsIds)
        res.send(tagsIds)
     })
})

router.patch('/:id', async (req, res) => {
    const { id: projectId } = req.params
    const { title, description, url, tags: tagsIds, images} = req.body
    console.log(title, description);

    const project = await Project.update({
        title, description, url
    }, {
        where: { 
            id: projectId 
        }
    })

    res.json(project)
})

router.delete('/delete', (req, res) => {
    res.json('rty')
})

export default router