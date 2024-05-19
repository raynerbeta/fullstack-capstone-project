const express = require('express')
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Get all gifts
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const giftC = db.collection('gifts');
        const gifts = await giftC.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        logger.console.error('Error fetching gifts', e);
        next(e);
    }
});

// Get a single gift by ID
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const giftC = db.collection('gifts');
        const id = req.params.id;
        const gift = await giftC.findOne({id});
        if (!gift) {
            return res.status(404).send('Gift not found');
        }
        res.json(gift);
    } catch (e) {
        logger.console.error('Error fetching gift', e);
        next(e);
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gift = await collection.insertOne(req.body);
        res.status(201).json(gift.ops[0]);
    } catch (e) {
        logger.console.error('Error creating gift', e);
        next(e);
    }
});

module.exports = router;
