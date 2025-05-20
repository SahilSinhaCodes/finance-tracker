import express from 'express';
import Transaction from '../models/Transaction.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /transactions – Add transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = await Transaction.create({
      user: req.user,
      type,
      amount,
      category,
      description,
      date,
    });
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Add transaction error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /transactions – Get all transactions for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /transactions/:id – Delete transaction by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    res.json({ msg: 'Transaction deleted', transaction });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
