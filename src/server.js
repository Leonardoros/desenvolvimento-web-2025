// server.js
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'your_db_name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

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

// ---

// ### Rotas de Usuários

// LISTAR todos os usuários
app.get("/users", async (_req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, name, email FROM users ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar usuários" });
    }
});

// MOSTRAR um usuário específico
app.get("/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de usuário inválido" });
    try {
        const [rows] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        res.json(rows[0]);
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
        const [result] = await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
        res.status(201).json({ id: result.insertId, name, email });
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
        const [result] = await pool.query(
            "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), password = COALESCE(?, password) WHERE id = ?",
            [name ?? null, email ?? null, password ?? null, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        const [updatedUser] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [id]);
        res.json(updatedUser[0]);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

// DELETAR um usuário
app.delete("/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de usuário inválido" });
    try {
        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

// --- Rotas de Transações

// LISTAR todas as transações
app.get("/transactions", async (_req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM transactions ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar transações" });
    }
});

// MOSTRAR uma transação específica
app.get("/transactions/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de transação inválido" });
    try {
        const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Transação não encontrada" });
        res.json(rows[0]);
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
        const [result] = await pool.query(
            "INSERT INTO transactions (user_id, amount, description, type) VALUES (?, ?, ?, ?)",
            [user_id, amount, description, type]
        );
        const [createdTransaction] = await pool.query("SELECT * FROM transactions WHERE id = ?", [result.insertId]);
        res.status(201).json(createdTransaction[0]);
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
        const [result] = await pool.query(
            "UPDATE transactions SET user_id = COALESCE(?, user_id), amount = COALESCE(?, amount), description = COALESCE(?, description), type = COALESCE(?, type) WHERE id = ?",
            [user_id ?? null, amount ?? null, description ?? null, type ?? null, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Transação não encontrada" });
        const [updatedTransaction] = await pool.query("SELECT * FROM transactions WHERE id = ?", [id]);
        res.json(updatedTransaction[0]);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar transação" });
    }
});

// DELETAR uma transação
app.delete("/transactions/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de transação inválido" });
    try {
        const [result] = await pool.query("DELETE FROM transactions WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Transação não encontrada" });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar transação" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));