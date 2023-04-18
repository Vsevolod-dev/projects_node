import { Sequelize } from "sequelize";
import User from "./models/user";
import Project from "./models/project";
import Image from "./models/image";
import Tag from "./models/tag";

function applyExtraSetup(sequelize: Sequelize) {

	User.hasMany(Project)

	Project.belongsTo(User);
	Project.hasMany(Image);
	Project.belongsToMany(Tag, { through: 'project_tag', foreignKey: 'project_id', otherKey: 'tag_id' });

	Tag.belongsToMany(Project, { through: 'project_tag', foreignKey: 'tag_id', otherKey: 'project_id' });
	
	Image.belongsTo(Project)
}

export default applyExtraSetup
