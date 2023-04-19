import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
    userId: string
}

export interface CustomRequest extends Request {
    userId: string;
}