const express = require('express');
const Cart = require('../models/cart.model');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const cart = await Cart.create({ products: [] });

        res.status(201).json({
            status: 'success',
            payload: cart
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate('products.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});




const Product = require('../models/product.model');

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        const product = await Product.findById(pid);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        const existingProduct = cart.products.find(
            item => item.product.toString() === pid
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        await cart.save();

        res.json({
            status: 'success',
            payload: cart
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;