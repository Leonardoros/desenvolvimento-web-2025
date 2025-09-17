// server.js
import express from 'express';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

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

//  Rotas de Usuários

// LISTAR todos os usuários
app.get("/users", async (_req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
            order: [['id', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar usuários" });
    }
});

// MOSTRAR um usuário específico
app.get("/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de usuário inválido" });
    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'email']
        });
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

// CRIAR um novo usuário
app.post("/users", async (req, res) => {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    }
    try {
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

// ATUALIZAR (PATCH) um usuário
app.patch("/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, password } = req.body ?? {};
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de usuário inválido" });
    if (!name && !email && !password) {
        return res.status(400).json({ error: "Envie nome, email ou senha para atualizar" });
    }
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        await user.update({ name, email, password });
        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

// DELETAR um usuário
app.delete("/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de usuário inválido" });
    try {
        const deletedRows = await User.destroy({ where: { id } });
        if (deletedRows === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

// 

//  Rotas de Transações

// LISTAR todas as transações
app.get("/transactions", async (_req, res) => {
    try {
        const transactions = await Transaction.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar transações" });
    }
});

// MOSTRAR uma transação específica
app.get("/transactions/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de transação inválido" });
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) return res.status(404).json({ error: "Transação não encontrada" });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar transação" });
    }
});

// CRIAR uma nova transação
app.post("/transactions", async (req, res) => {
    const { user_id, amount, description, type } = req.body ?? {};
    if (!user_id || !amount || !description || !type) {
        return res.status(400).json({ error: "Campos obrigatórios: user_id, amount, description, type" });
    }
    if (type !== 'expense' && type !== 'income') {
        return res.status(400).json({ error: "Tipo de transação deve ser 'expense' ou 'income'" });
    }
    try {
        const newTransaction = await Transaction.create({ user_id, amount, description, type });
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar transação" });
    }
});

// ATUALIZAR (PATCH) uma transação
app.patch("/transactions/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { user_id, amount, description, type } = req.body ?? {};
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de transação inválido" });
    if (!user_id && !amount && !description && !type) {
        return res.status(400).json({ error: "Nenhum campo para atualizar foi enviado" });
    }
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) return res.status(404).json({ error: "Transação não encontrada" });

        await transaction.update({ user_id, amount, description, type });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar transação" });
    }
});

// DELETAR uma transação
app.delete("/transactions/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de transação inválido" });
    try {
        const deletedRows = await Transaction.destroy({ where: { id } });
        if (deletedRows === 0) return res.status(404).json({ error: "Transação não encontrada" });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar transação" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));