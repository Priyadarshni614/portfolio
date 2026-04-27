require('dotenv').config();
const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('🌍 PostgreSQL Connected Successfully!');
    } catch (error) {
        console.error('❌ Error connecting to PostgreSQL:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };