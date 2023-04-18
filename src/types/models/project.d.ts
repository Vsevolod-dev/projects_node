import {Model, CreationOptional, InferAttributes, InferCreationAttributes} from "sequelize";
import Tag from "../../sequelize/models/tag";

export default interface Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
    id: CreationOptional<number>;
    title: string
    description?: string
    url?: string
    user_id: number
    // tags?: Tag[]

    // addProjects: HasManyAddAssociationsMixin<Project, number>;
    getTags?: HasManyGetAssociationsMixin<Tag>
    addTags?: HasManyAddAssociationsMixin<Tag, number>
}