// server.js
import express from 'express';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

// Importar os arquivos de rotas
import usersRouter from './routes/users.routes.js';
import transactionsRouter from './routes/transactions.routes.js';


const app = express();
app.use(express.json());

// Rota raiz para documentação básica da API
app.get("/", async (_req, res) => {
    try {
        const routes = {
            "Users": {
                "LIST_USERS": "GET /users",
                "GET_USER": "GET /users/:id",
                "CREATE_USER": "POST /users BODY: { name: 'string', email: 'string', password: 'string' }",
                "UPDATE_USER": "PATCH /users/:id BODY: { name: 'string' || email: 'string' || password: 'string' }",
                "DELETE_USER": "DELETE /users/:id",
            },
            "Transactions": {
                "LIST_TRANSACTIONS": "GET /transactions",
                "GET_TRANSACTION": "GET /transactions/:id",
                "CREATE_TRANSACTION": "POST /transactions BODY: { user_id: number, amount: number, description: 'string', type: 'expense' || 'income' }",
                "UPDATE_TRANSACTION": "PATCH /transactions/:id BODY: { user_id: number || amount: number || description: 'string' || type: 'expense' || 'income' }",
                "DELETE_TRANSACTION": "DELETE /transactions/:id",
            }
        };
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// Conecte os roteadores ao aplicativo Express
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));