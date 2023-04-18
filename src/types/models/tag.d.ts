import {Model, CreationOptional, InferAttributes, InferCreationAttributes} from "sequelize";

export default interface Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
    id: CreationOptional<number>;
    title: string;
    description?: string;
}