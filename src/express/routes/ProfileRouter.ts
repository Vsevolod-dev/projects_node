import express from 'express';
import * as profileController from '../../controllers/profileController'


const router = express.Router()

router.get('/', profileController.getProfile)
router.get('/:id', profileController.getProfile)
router.patch('/', profileController.updateProfile)
router.get('/:id/projects', profileController.profileProjects)

export default router