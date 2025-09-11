import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv'; // Forma de importar o dotenv em ES modules
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

// Create a new Sequelize instance for MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,    // Name of the database
  process.env.DB_USER,    // Database user
  process.env.DB_PASS,    // Database password
  {
    host: process.env.DB_HOST,    // Database host
    port: process.env.DB_PORT || 3306, // MySQL default port is 3306
    dialect: 'mysql',             
    logging: process.env.NODE_ENV === 'development' ? console.log : false,  
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the MySQL database:', error);
  }
};

testConnection();

// Exporta a instância do Sequelize para ser usada em outros arquivos
export default sequelize;
