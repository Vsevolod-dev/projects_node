import {Model, CreationOptional, InferAttributes, InferCreationAttributes, HasManySetAssociationsMixin} from "sequelize";
import Project from "../../sequelize/models/project";

export default interface Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
    id: CreationOptional<number>;
    name: string,
    path: string,
    extension: string,
    size: number,
    project_id?: number | null,
}