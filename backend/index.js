const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const server = express();

const corsOptions = {
    origin: 'https://agulha-e-linha.up.railway.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self' fonts.googleapis.com");
    next();
});

let connection;

async function createConnection() {
    connection = await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        port: process.env.MYSQLPORT,
        database: process.env.MYSQLDATABASE,
    });

    console.log('Conexão com o banco de dados bem-sucedida');
}

async function startServer() {
    await createConnection();

    server.get('/get', async (req, res) => {
        try {
            const [rows] = await connection.execute('SELECT * FROM bonecas');
            return res.json(rows);
        } catch (err) {
            console.error('Erro ao buscar bonecas no banco de dados:', err);
            return res.status(500).json({ error: 'Erro ao buscar bonecas' });
        }
    });

    const PORT = 3000;
    server.listen(PORT, () => {
    console.log(`Servidor HTTPS está ouvindo na porta ${PORT}`);
});

}

startServer();
