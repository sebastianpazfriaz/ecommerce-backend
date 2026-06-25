const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');


const connectDB = require('./src/config/db');

const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

dotenv.config();

const app = express();

app.engine('handlebars', engine());

app.set('view engine', 'handlebars');
app.set('views', './src/views');

const server = http.createServer(app);

const io = new Server(server);

app.set('io', io);


io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

app.use(express.json());

app.get('/products', (req,res)=>{
    res.render('products');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

connectDB();

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});