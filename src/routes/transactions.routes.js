// routes/transactions.routes.js
import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js'; 
import User from '../models/User.js'; 

const router = Router();

// Listar todas as transações (agora com dados da categoria)
router.get("/", async (_req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [Category], // Inclui os dados da categoria
            order: [['createdAt', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar transações" });
    }
});

// Mostrar uma transação específica
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de transação inválido" });
    try {
        const transaction = await Transaction.findByPk(id, {
            include: [Category] // Inclui os dados da categoria
        });
        if (!transaction) return res.status(404).json({ error: "Transação não encontrada" });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar transação" });
    }
});

// Ciar uma nova transação 
router.post("/", async (req, res) => {
    const { user_id, amount, description, type, category_id, date } = req.body ?? {};
    
    if (!user_id || !amount || !type || !category_id || !date) {
        return res.status(400).json({ 
            error: "Campos obrigatórios: user_id, amount, type, category_id, date" 
        });
    }
    
    if (type !== 'expense' && type !== 'income') {
        return res.status(400).json({ error: "Tipo de transação deve ser 'expense' ou 'income'" });
    }
    
    // Valida se a categoria existe
    try {
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(400).json({ error: "Categoria não encontrada" });
        }
        
        // Valida se o tipo da transação bate com o tipo da categoria
        if (category.type !== type) {
            return res.status(400).json({ 
                error: `Tipo de transação (${type}) não compatível com categoria (${category.type})` 
            });
        }
    } catch (error) {
        return res.status(400).json({ error: "Erro ao validar categoria" });
    }
    
    try {
        const newTransaction = await Transaction.create({ 
            user_id, 
            amount, 
            description, 
            type, 
            category_id, 
            date         
        });
        
        // Retorna a transação com dados completos da categoria
        const transactionWithCategory = await Transaction.findByPk(newTransaction.id, {
            include: [Category]
        });
        
        res.status(201).json(transactionWithCategory);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar transação: " + error.message });
    }

    // 1. Valida se amount é número positivo
if (isNaN(amount) || Number(amount) <= 0) {
  return res.status(400).json({ error: "Amount deve ser um número positivo" });
}

// 2. Valida se a data é válida
if (!Date.parse(date)) {
  return res.status(400).json({ error: "Data inválida" });
}

// 3. Valida se user_id existe no banco
try {
  const User = await import('./User.js'); // ou importe no topo
  const userExists = await User.default.findByPk(user_id);
  if (!userExists) {
    return res.status(400).json({ error: "Usuário não encontrado" });
  }
} catch (error) {
  return res.status(400).json({ error: "Erro ao validar usuário" });
}
});

// ATUALIZAR (PATCH) uma transação
router.patch("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { user_id, amount, description, type, category_id, date } = req.body ?? {};
    
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID de transação inválido" });
    
    // Validação atualizada
    if (!user_id && !amount && !description && !type && !category_id && !date) {
        return res.status(400).json({ error: "Nenhum campo para atualizar foi enviado" });
    }
    
    // Valida category_id se for enviado
    if (category_id) {
        try {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(400).json({ error: "Categoria não encontrada" });
            }
            
            // Valida compatibilidade type/category se ambos forem enviados
            if (type && category.type !== type) {
                return res.status(400).json({ 
                    error: `Tipo de transação (${type}) não compatível com categoria (${category.type})` 
                });
            }
        } catch (error) {
            return res.status(400).json({ error: "Erro ao validar categoria" });
        }
    }
    
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) return res.status(404).json({ error: "Transação não encontrada" });

        await transaction.update({ user_id, amount, description, type, category_id, date });
        
        // Retorna a transação atualizada com dados da categoria
        const updatedTransaction = await Transaction.findByPk(id, {
            include: [Category]
        });
        
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar transação: " + error.message });
    }
});

// DELETAR uma transação (mantém igual)
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