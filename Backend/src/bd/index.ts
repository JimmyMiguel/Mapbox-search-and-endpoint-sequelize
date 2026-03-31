import dotenv from "dotenv"
import { log } from "node:console";
import { Dialect, Sequelize } from "sequelize";

dotenv.config()

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('no está definido en .env');
}
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT as Dialect,
        logging:false,
        dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false 
            }}
        
    }
)
 
