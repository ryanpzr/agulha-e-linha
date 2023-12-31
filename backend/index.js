const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const https = require('https');
const fs = require('fs');

require('dotenv').config();

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self' fonts.googleapis.com");
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

let connection;

async function createConnection() {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Conexão com o banco de dados bem-sucedida');
}

// Para encerrar o servidor de forma segura e fechar a conexão com o banco de dados
process.on('SIGINT', async () => {
    if (connection) {
        await connection.end();
    }
    process.exit(0);
});

// Função para inicializar o servidor
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

    server.delete('/delete', async (req, res) => {
        const { nome } = req.body;
        const sql = 'DELETE FROM bonecas WHERE nome = ?';

        try {
            const [result] = await connection.execute(sql, [nome]);

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

        connection.query(sql, values, (err, result) => {
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
        }
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Servidor HTTPS está ouvindo na porta ${PORT}`);
    });
}

startServer();
