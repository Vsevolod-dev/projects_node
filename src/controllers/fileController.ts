import { Request, Response } from "express"
import formidable, { File } from "formidable"
import os from "os"
import Image from "../sequelize/models/image"
import sequelize from "../sequelize"

const form = formidable({
    filename: (name, ext, part, form) => {
        const extension = part.mimetype?.split('/')[1]
        return `${new Date().getTime()}${Math.floor(Math.random() * 100)}.${extension}`
    },
    filter: (part) => {
        const {name, originalFilename, mimetype} = part

        // keep only images
        return (mimetype && mimetype.includes("image")) ? true : false;
    },
    uploadDir: `${os.homedir()}/images`, //TODO: add to readme file info about specific directory
    maxFileSize: 5 * 1024 * 1024 // 5mb
    
})

export const upload = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction()
    let info: File | null = null
    
    try {
        form.parse(req, async (err, fields, files) => {
            if (err || !files.filetoupload) {
                await transaction.commit()
                res.send(err)
                return;
            }
            
            info = files.filetoupload as File

            if (info.originalFilename && info.mimetype) {
                const extension = info.mimetype.split('/')[1]
    
                if (extension) {
                    await Image.create({
                        name: info.originalFilename,
                        extension,
                        size: info.size,
                        path: info.newFilename
                    }, {transaction})

                    await transaction.commit()
                    res.json({image: info, message: "Successfully uploaded"})
                } else {
                    await transaction.commit()
                    res.status(400).json({message: "Uploading error"})
                }
            } else {
                await transaction.commit()
                res.status(400).json({message: "Uploading error"})
            }
        });
    } catch (e) {
        transaction.rollback()
        res.status(500).json({message: "Uploading error"})
    }
}

export const getImage = (req: Request, res: Response) => {
    const name = req.params.name
    res.sendFile(`${os.homedir()}/images/${name}`)
}