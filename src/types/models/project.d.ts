import {Model, 
    CreationOptional, 
    InferAttributes, 
    InferCreationAttributes, 
    HasManyGetAssociationsMixin, 
    HasManyAddAssociationsMixin, 
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin
} from "sequelize";
import Tag from "../../sequelize/models/tag";
import Image from "./image";

export default interface Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
    id: CreationOptional<number>;
    title: string
    description?: string
    url?: string
    user_id: number
    images?: Image[]
    image?: string

    // addProjects: HasManyAddAssociationsMixin<Project, number>;
    getTags: HasManyGetAssociationsMixin<Tag>
    addTags: HasManyAddAssociationsMixin<Tag, number>
    setTags: HasManySetAssociationsMixin<Tag, number>
}