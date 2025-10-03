import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
    },
    // Adicione estas linhas para mapear corretamente
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at' // Nome real no banco
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at' // Nome real no banco
    }
}, {
    tableName: 'categories',
    timestamps: true, // Mantém true
    createdAt: 'created_at', // Mapeia createdAt para created_at
    updatedAt: 'updated_at'  // Mapeia updatedAt para updated_at
});

export default Category;