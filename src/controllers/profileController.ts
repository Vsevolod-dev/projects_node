import { Request, Response } from "express";
import User from "../sequelize/models/user";
import { CustomRequest } from "../types";
import Project from "../sequelize/models/project";
import sequelize from "../sequelize";
import validator from "validator";


export const getProfile = async (req: Request, res: Response) => {
    let userId = parseInt((req as CustomRequest).userId) // own profile
    res.header('user_by_token', userId.toString())

    if (req.params.id) {
        userId = parseInt(req.params.id) // alien profile
    }

    const user = await User.findByPk(userId)

    res.send(user)
}

export const updateProfile = async (req: Request, res: Response) => {
    let userId = parseInt((req as CustomRequest).userId) // own profile
    const {name, email, phone, job, github, instagram, telegram} = req.body
    const user = await User.findByPk(userId)

    if (!user) {
        res.status(404).send({message: 'User is not found'})
        return
    }

    if (phone && !validator.isMobilePhone(phone)) {
        res.status(400).send({message: 'Phone is not valid'})
        return
    }

    if (email) {
        if (!validator.isEmail(email)) {
            res.status(400).send({message: 'Email is not valid'})
            return
        }

        const existedUser = await User.findOne({where: {
            email
        }})
    
        if (existedUser) {
            if (existedUser.id !== userId) {
                res.status(400).send({message: 'This email is in use by another user'})
                return
            }
        }
    }

    const transaction = await sequelize.transaction()

    try {
        const result = await user.update({
            name, phone, job, github, instagram, telegram
        }, { transaction })

        await transaction.commit()
        res.send({user: result, message: "Updating successfully"})
    } catch (e) {
        transaction.rollback()
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