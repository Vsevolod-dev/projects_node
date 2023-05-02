import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
    userId: number
}

export interface CustomRequest extends Request {
    userId: string;
}

export interface CreateProjectRequest {
    title: string
    description?: string
    url?: string
    tags: number[]
    images: RequestImages[]
}

export interface RequestImages {
    path: string
    desc?: string
}