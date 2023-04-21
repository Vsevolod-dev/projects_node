import { Request, Response } from "express";
import User from "../sequelize/models/user";
import { CustomRequest } from "../types";
import Project from "../sequelize/models/project";
import sequelize from "../sequelize";


export const getProfile = async (req: Request, res: Response) => {
    let userId = (req as CustomRequest).userId // own profile

    if (req.params.id) {
        userId = parseInt(req.params.id) // alien profile
    }

    const user = await User.findByPk(userId)

    res.send(user)
}

export const updateProfile = async (req: Request, res: Response) => {
    let userId = (req as CustomRequest).userId // own profile
    const {name, phone, job, github, instagram, telegram} = req.body
    const user = await User.findByPk(userId)

    if (!user) {
        res.status(404).send({message: 'User is not found'})
        return
    }

    const t = await sequelize.transaction()

    try {
        const result = await user.update({
            name, phone, job, github, instagram, telegram
        }, { transaction: t })

        await t.commit()
        res.send({user: result, message: "Updating successfully"})
    } catch (e) {
        t.rollback()
        res.status(500).send({message: "Updating error"})
    }

}

export const profileProjects = async (req: Request, res: Response) => {
    const userId = req.params.id 

    const projects = await Project.findAll({where: {
        user_id: userId
    }})

    res.send(projects)
}