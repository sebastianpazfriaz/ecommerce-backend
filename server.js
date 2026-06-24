const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

connectDB();

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});