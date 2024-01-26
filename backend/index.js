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

server.delete('/delete', async (req, res) => {
    const { nome } = req.body;
    const sql = 'DELETE FROM bonecas WHERE nome = ?';
    let connection;

    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(sql, [nome]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Boneca não encontrada' });
        } else {
            res.json({ message: 'Boneca excluída com sucesso' });
        }
    } catch (err) {
        console.error('Erro ao excluir a boneca:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        if (connection) {
            connection.release(); // Certifique-se de liberar a conexão de volta ao pool
        }
    }
});

server.post('/upload', upload.single('foto'), async (req, res) => {
    const { nome, subnome, preco, subpreco } = req.body;
    const foto = req.file;

    if (!foto) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const sql = 'INSERT INTO bonecas (nome, subnome, preco, subpreco, foto) VALUES (?, ?, ?, ?, ?)';
    const values = [nome, subnome, preco, subpreco, foto.buffer];
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.query(sql, values);
        console.log('Boneca inserida com sucesso no banco de dados');
        const novaBoneca = { nome, subnome, preco, subpreco, foto: foto.buffer };
        res.json(novaBoneca);
    } catch (err) {
        console.error('Erro ao inserir boneca no banco de dados:', err);
        res.status(500).json({ error: 'Erro ao salvar a boneca' });
    } finally {
        if (connection) {
            connection.release(); // Certifique-se de liberar a conexão de volta ao pool
        }
    }
});

server.get('/imagem/:nome', async (req, res) => {
    const { nome } = req.params;
    const sql = 'SELECT foto FROM bonecas WHERE nome = ?';
    let connection;

    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(sql, [nome]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Boneca não encontrada' });
        }

        const imagem = rows[0].foto;

        res.contentType('image/jpeg');
        res.end(imagem);
    } catch (err) {
        console.error('Erro ao buscar imagem no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao buscar imagem' });
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

