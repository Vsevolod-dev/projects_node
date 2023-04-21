import { Sequelize, Dialect } from 'sequelize'
// const { applyExtraSetup } = require('./extra-setup');
import * as dotenv from 'dotenv'
dotenv.config()



const dbSchema = process.env.DB_SCHEMA as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbDialect = process.env.DB_DIALECT as Dialect
const dbPassword = process.env.DB_PASSWORD

const sequelize: Sequelize = new Sequelize(dbSchema, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    logging: false
})

// applyExtraSetup(sequelize)

export default sequelize;
