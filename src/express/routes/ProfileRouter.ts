import express, { Request, Response, NextFunction } from 'express';
const router = express.Router()

//Todo: add auth middleware
router.get('/', (req: Request, res: Response) => {
    res.json('profile')
})

router.get('/:id', (req, res) => {
    res.json('id')
})

router.patch('/:id', (req, res) => {
    res.json('update')
})

router.get('/:id/projects', (req, res) => {
    res.json('projects')
})

export default router