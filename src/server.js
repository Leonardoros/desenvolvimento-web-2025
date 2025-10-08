// server.js
import express from 'express';
import User from './models/User.js';
import Transaction from './models/Transaction.js';
import Category from './models/Category.js';
import sequelize from './db.js'; // Importa a instância do Sequelize
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


// Importar os arquivos de rotas
import usersRouter from './routes/users.routes.js';
import transactionsRouter from './routes/transactions.routes.js';
import categoriesRouter from './routes/categories.routes.js';

const app = express(); // Cria a aplicação Express
app.use(helmet());
app.use(express.json());

const transactionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Apenas 20 requests por IP 
  message: { error: 'Limite de requisições excedido. Tente novamente em 15 minutos.' }
});

app.use('/api/transactions', transactionsLimiter);

// definir as rotas

// Rota de verificação de saúde da API
app.get("/health", (req, res) => {
  res.json({ 
    ok: true, 
    message: 'API está saudável!',
    database: 'Conectado',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz para documentação básica da API
app.get("/", async (_req, res) => {
    try {
        const routes = {
            "Users": {
                "LIST_USERS": "GET /api/users",
                "GET_USER": "GET /api/users/:id",
                "CREATE_USER": "POST /api/users BODY: { name: 'string', email: 'string', password: 'string' }",
                "UPDATE_USER": "PATCH /api/users/:id BODY: { name: 'string' || email: 'string' || password: 'string' }",
                "DELETE_USER": "DELETE /api/users/:id",
            },
            "Transactions": {
                "LIST_TRANSACTIONS": "GET /api/transactions",
                "GET_TRANSACTION": "GET /api/transactions/:id",
                "CREATE_TRANSACTION": "POST /api/transactions BODY: { user_id: number, amount: number, description: 'string', type: 'expense' || 'income', category_id: number, date: 'string' }",
                "UPDATE_TRANSACTION": "PATCH /api/transactions/:id BODY: { user_id: number || amount: number || description: 'string' || type: 'expense' || 'income' || category_id: number || date: 'string' }",
                "DELETE_TRANSACTION": "DELETE /api/transactions/:id",
            },
            "Categories": {
                "LIST_CATEGORIES": "GET /api/categories",
                "GET_CATEGORY": "GET /api/categories/:id",
                "GET_CATEGORIES_BY_TYPE": "GET /api/categories/type/:type",
            }
        };
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// Conecta os roteadores ao aplicativo Express
app.use("/api/users", usersRouter); // 👈 Adicione /api/
app.use("/api/transactions", transactionsRouter); // 👈 Adicione /api/
app.use('/api/categories', categoriesRouter);

// Sincronizar modelos com o banco
const syncDatabase = async () => {
  try {
    await sequelize.sync(); // Cria as tabelas se não existirem
    console.log('✅ Tabelas sincronizadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao sincronizar tabelas:', error);
  }
};
syncDatabase();

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));