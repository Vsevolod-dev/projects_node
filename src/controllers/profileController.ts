import { Request, Response } from "express";
import User from "../sequelize/models/user";
import { CustomRequest } from "../types";
import Project from "../sequelize/models/project";


export const getProfile = async (req: Request, res: Response) => {
    let userId = (req as CustomRequest).userId // own profile

    if (req.params.id) {
        userId = req.params.id // alien profile
    }

    const user = await User.findByPk(userId)

    res.send(user)
}

export const updateProfile = async (req: Request, res: Response) => {
    let userId = (req as CustomRequest).userId // own profile
    const {name, phone, job, github, instagram, telegram} = req.body
    const user = await User.findByPk(userId)

    const result = await user?.update({
        name, phone, job, github, instagram, telegram
    })

    res.send(result)
}

export const profileProjects = async (req: Request, res: Response) => {
    const userId = req.params.id 

    const projects = await Project.findAll({where: {
        user_id: userId
    }})

    res.send(projects)
}