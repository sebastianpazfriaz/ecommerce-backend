const express = require('express');
const Product = require('../models/product.model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const {
            limit = 10,
            page = 1,
            sort,
            query
        } = req.query;


        let filter = {};

        if (query) {
            filter = {
                category: query
            };
        }


        let options = {
            limit,
            page
        };


        if (sort) {
            options.sort = {
                price: sort === 'asc' ? 1 : -1
            };
        }


        const result = await Product.paginate(filter, options);


        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: null,
            nextLink: null
        });


    } catch (error) {

        res.status(500).json({
            status: 'error',
            message: error.message
        });

    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: product
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);

        req.app.get('io').emit('productUpdate', {
        action: 'create',
        product
        });

        res.status(201).json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});



router.put('/:pid', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.pid,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        req.app.get('io').emit('productUpdate', {
            action: 'update',
            product
        });

        res.json({
            status: 'success',
            payload: product
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.pid);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        req.app.get('io').emit('productUpdate', {
            action: 'delete',
            product
        });

        res.json({
            status: 'success',
            message: 'Producto eliminado'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;