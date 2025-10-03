// routes/categories.routes.js
import { Router } from 'express';
import Category from '../models/Category.js';

const router = Router();

// LISTAR todas as categorias
router.get("/", async (_req, res) => {
    try {
        console.log('🟡 Tentando buscar categorias...');
        const categories = await Category.findAll({
            order: [
                ['type', 'DESC'],
                ['name', 'ASC']
            ]
        });
        console.log('✅ Categorias encontradas:', categories.length);
        res.json(categories);
    } catch (error) {
        console.error('❌ Erro detalhado:', error);
        res.status(500).json({ error: "Erro ao listar categorias: " + error.message });
    }
});

// Listar categorias por tipo (income ou expense)
router.get("/type/:type", async (req, res) => {
    const { type } = req.params;
    
    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: "Tipo deve ser 'income' ou 'expense'" });
    }
    
    try {
        const categories = await Category.findAll({
            where: { type },
            order: [['name', 'ASC']]
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar categorias por tipo" });
    }
});

// MOSTRAR uma categoria específica
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID de categoria inválido" });
    }
    
    try {
        const category = await Category.findByPk(id);
        if (!category) return res.status(404).json({ error: "Categoria não encontrada" });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar categoria" });
    }
});

export default router;