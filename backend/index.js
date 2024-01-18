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
    try {
        const [rows] = await pool.execute('SELECT * FROM bonecas');
        return res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar bonecas no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao buscar bonecas' });
    }
});

server.delete('/delete', async (req, res) => {
    const { nome } = req.body;
    const sql = 'DELETE FROM bonecas WHERE nome = ?';

    try {
        const [result] = await pool.execute(sql, [nome]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Boneca não encontrada' });
        } else {
            res.json({ message: 'Boneca excluída com sucesso' });
        }
    } catch (err) {
        console.error('Erro ao excluir a boneca:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

server.post('/upload', upload.single('foto'), (req, res) => {
    const { nome, subnome, preco, subpreco } = req.body;
    const foto = req.file;

    if (!foto) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const sql = 'INSERT INTO bonecas (nome, subnome, preco, subpreco, foto) VALUES (?, ?, ?, ?, ?)';
    const values = [nome, subnome, preco, subpreco, foto.buffer];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir boneca no banco de dados:', err);
            return res.status(500).json({ error: 'Erro ao salvar a boneca' });
        } else {
            console.log('Boneca inserida com sucesso no banco de dados');
            const novaBoneca = { nome, subnome, preco, subpreco, foto: foto.buffer, id: result.insertId };
            return res.json(novaBoneca);
        }
    });
});

server.get('/imagem/:nome', async (req, res) => {
    const { nome } = req.params;
    const sql = 'SELECT foto FROM bonecas WHERE nome = ?';
    try {
        const [rows] = await pool.execute(sql, [nome]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Boneca não encontrada' });
        }

        const imagem = rows[0].foto;

        res.contentType('image/jpeg');
        res.end(imagem);
    } catch (err) {
        console.error('Erro ao buscar imagem no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao buscar imagem' });
    }
});

const PORT = 3000;
createPool().then(() => {
    server.listen(PORT, () => {
        console.log(`Servidor HTTPS está ouvindo na porta ${PORT}`);
    });
});
