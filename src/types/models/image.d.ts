import {Model, CreationOptional, InferAttributes, InferCreationAttributes} from "sequelize";

export default interface Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
    id: CreationOptional<number>;
    name: string,
    path: string,
    extension: string,
    size: number,
    project_id: number,
}