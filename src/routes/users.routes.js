// routes/users.routes.js
import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// LISTAR todos os usuários
router.get("/", async (_req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
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
router.patch("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

export default router;