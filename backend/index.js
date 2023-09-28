const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usando o mysql2/promise para suportar consultas assíncronas.
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage para salvar os dados da imagem em memória.
const upload = multer({ storage: storage });
const https = require('https');
const fs = require('fs');

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self' fonts.googleapis.com");
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir acesso de qualquer origem
    next();
});

// Cria um pool de conexões para o MySQL
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 10 // Ajuste o limite de conexões conforme necessário
});

server.get('/get', async (req, res) => {
    try {
        const [rows] = await dbPool.execute('SELECT * FROM bonecas');
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
        const [result] = await dbPool.execute(sql, [nome]);

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
    const foto = req.file; // Obtém o arquivo de imagem

    // Certifique-se de tratar o erro se a imagem não for enviada
    if (!foto) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Insira a nova boneca no banco de dados, incluindo a imagem
    const sql = 'INSERT INTO bonecas (nome, subnome, preco, subpreco, foto) VALUES (?, ?, ?, ?, ?)';
    const values = [nome, subnome, preco, subpreco, foto.buffer]; // Use foto.buffer para os dados binários da imagem

    dbPool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir boneca no banco de dados:', err);
            return res.status(500).json({ error: 'Erro ao salvar a boneca' });
        } else {
            console.log('Boneca inserida com sucesso no banco de dados');
            const novaBoneca = { nome, subnome, preco, subpreco, foto: foto.buffer, id: result.insertId };

            // Envie uma resposta com a nova boneca, incluindo o ID gerado
            return res.json(novaBoneca);
        }
    });
});

server.get('/imagem/:nome', async (req, res) => {
    const { nome } = req.params;
    const sql = 'SELECT foto FROM bonecas WHERE nome = ?';
    try {
        const [rows] = await dbPool.execute(sql, [nome]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Boneca não encontrada' });
        }

        const imagem = rows[0].foto;

        // Defina o tipo de conteúdo da resposta como imagem JPEG
        res.contentType('image/jpeg');

        // Envie o conteúdo da imagem como resposta
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
