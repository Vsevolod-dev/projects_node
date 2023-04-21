import sequelize from '..';

const ProjectTag = sequelize.define('project_tag', {}, {tableName: 'project_tag', timestamps: false})

export default ProjectTag
