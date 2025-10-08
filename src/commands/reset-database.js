import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
    DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME,
} = process.env;

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASS', 'DB_NAME'];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(`❌ Erro: A variável de ambiente ${varName} não está definida.`);
        process.exit(1);
    }
}

async function resetDatabase() {
    let connection;
    
    try {
        console.log('🔌 Conectando ao MySQL...');
        
        // Conecta sem database específico
        connection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASS,
        });

        console.log('✅ Conectado ao MySQL');

        // 1. Drop do database se existir - usa query() em vez de execute()
        await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
        console.log(`✅ Database ${DB_NAME} dropado`);

        // 2. Cria o database novamente
        await connection.query(`CREATE DATABASE \`${DB_NAME}\``);
        console.log(`✅ Database ${DB_NAME} criado`);

        console.log('✅ Database resetado com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao resetar database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('✅ Conexão fechada');
        }
    }
}

resetDatabase();