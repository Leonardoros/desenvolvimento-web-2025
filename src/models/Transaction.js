import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';
import Category from './Category.js'; 

const Transaction = sequelize.define('Transaction', {
    amount: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    description: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    type: { 
        type: DataTypes.ENUM('expense', 'income'), 
        allowNull: false 
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories', // Nome da tabela no banco
            key: 'id'
        }
    }
}, {
    tableName: 'transactions', 
    timestamps: true //Cria created_at e updated_at automaticamente
});

// Relacionamentos
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

// Relacionamento com Category
Category.hasMany(Transaction, { foreignKey: 'category_id' });
Transaction.belongsTo(Category, { foreignKey: 'category_id' });

export default Transaction;