import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';

const Transaction = sequelize.define('Transaction', {
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('expense', 'income'), allowNull: false },
});

// Um usuário pode ter muitas transações
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

export default Transaction;