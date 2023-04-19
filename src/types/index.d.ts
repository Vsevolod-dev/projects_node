import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
    userId: number
}

export interface CustomRequest extends Request {
    userId: number;
}