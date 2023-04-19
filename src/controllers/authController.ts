import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import User from "../sequelize/models/user"
import jwt from "jsonwebtoken"


export const login = async (req: Request, res: Response) => {
    const {email, password} = req.query

    if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).send({'messsage': 'Params required'})
        return
    }

    const user = await User.findOne({
        attributes: ['id', 'password'],
        where: {
            email
        }
    })

    if (user) {
        let hash = user.password
        hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
        const compareRes = await bcrypt.compare(password, hash)

        if (compareRes) {
            const payload = { userId: user.id.toString() }
            const token = jwt.sign(payload, process.env.SECRET_KEY!, {
                expiresIn: '24h',
            });
            res.send({'messsage': 'Success', token})
        } else {
            res.status(400).send({'messsage': 'Incorrect password'})
        }

    } else {
        res.status(404).send({'messsage': 'User not found'})
    }
}

export const register = async (req: Request, res: Response) => {
    const {name, email, password, confirmPassword} = req.body

    if (!name || !email || !password || !confirmPassword) {
        res.status(400).send({message: 'Not enought data'})
        return
    }

    if (password !== confirmPassword) {
        res.status(400).send({message: 'Password mismatch'})
        return
    }

    const existedUser = await User.findOne({where: {
        email
    }})

    if (existedUser) {
        res.status(400).send({message: 'User with this email is already exist'})
        return
    }

    const hash = await bcrypt.hash(password, 7);

    if (hash) {
        const user = await User.create({
            name, 
            email, 
            password: hash
        }, {
            
        })

        res.send(user)
    } else {
        res.status(400).send({message: 'Something went wrong'})
    }
}