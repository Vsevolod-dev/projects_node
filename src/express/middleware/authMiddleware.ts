import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload, CustomRequest } from "../../types";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({message: 'User in not authorized'})    
        }

        const data = jwt.verify(token, process.env.SECRET_KEY!) as CustomJwtPayload;

        (req as CustomRequest).userId = data.userId.toString()

        next()
    } catch (e) {
        return res.status(401).json({message: 'User in not authorized'})
    }
}

export default checkAuth