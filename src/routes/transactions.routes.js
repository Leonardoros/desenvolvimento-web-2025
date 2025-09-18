// routes/transactions.routes.js
import { Router } from 'express';
import Transaction from '../models/Transaction.js';

const router = Router();

// LISTAR todas as transações
router.get("/", async (_req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
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
router.patch("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

export default router;