import express, { Request, Response } from 'express';
import checkAuth from '../middleware/authMiddleware';
import * as projectController from '../../controllers/projectController';


const router = express.Router()

router.get('/', projectController.getAllProjects)
router.get('/:id', projectController.getProject)
router.post('/', checkAuth, projectController.createProject)
router.patch('/:id', checkAuth, projectController.updateProject)
router.delete('/:id', checkAuth, projectController.deleteProject)

export default router