const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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

let pool;

async function createPool() {
    pool = await mysql.createPool({
        connectionLimit: 20,
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        port: process.env.MYSQLPORT,
        connectTimeout: 30000,
    });
    console.log('Pool de conexões com o banco de dados criado com sucesso');
}

server.get('/get', async (req, res) => {
    let connection;

    try {
        const [rows] = await pool.execute('SELECT * FROM bonecas');
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar bonecas no banco de dados:', err);
        res.status(500).json({ error: 'Erro ao buscar bonecas' });
    } finally {
        if (connection) {
            connection.release(); // Certifique-se de liberar a conexão de volta ao pool
        }
    }
});

const PORT = 3000;
createPool().then(() => {
    server.listen(PORT, () => {
        console.log(`Servidor HTTPS está ouvindo na porta ${PORT}`);
    });
});
