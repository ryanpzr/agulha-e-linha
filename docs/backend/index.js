const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer')
const storage = multer.memoryStorage(); // Use memory storage para salvar os dados da imagem em memória.
const upload = multer({ storage: storage });

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Configuração do banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados MySQL');
    }
});

const server = express();
server.use(bodyParser.json());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/get', (req, res) => {
    // Consulta o banco de dados para obter todas as bonecas
    const sql = 'SELECT * FROM bonecas';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erro ao buscar bonecas no banco de dados:', err);
            return res.status(500).json({ error: 'Erro ao buscar bonecas' });
        } else {
            // Retorna todas as bonecas encontradas no banco de dados
            return res.json(result);
        }
    });
});

server.delete('/delete', (req, res) => {
    const { nome } = req.body;
    const sql = 'DELETE FROM bonecas WHERE nome = ?';

    db.query(sql, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao excluir a boneca:', err);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
        }

        if (result.affectedRows === 0) {
            // Se nenhum registro foi excluído, significa que o nome não foi encontrado
            res.status(404).json({ message: 'Boneca não encontrada' });
        } else {
            res.json({ message: 'Boneca excluída com sucesso' });
        }
    });
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

    db.query(sql, values, (err, result) => {
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

server.get('/imagem/:nome', (req, res) => {
    const { nome } = req.params;

    // Consulta o banco de dados para obter a foto com base no nome
    const sql = 'SELECT foto FROM bonecas WHERE nome = ?';
    db.query(sql, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao buscar a imagem no banco de dados:', err);
            return res.status(500).json({ error: 'Erro ao buscar a imagem' });
        } else if (result.length === 0) {
            return res.status(404).json({ message: 'Boneca não encontrada' });
        } else {
            // Retorna a imagem como resposta
            const imagem = result[0].foto;
            res.contentType('image/jpeg'); // Define o tipo de conteúdo da resposta como imagem JPEG
            return res.end(imagem);
        }
    });
});

server.listen(3000 || process.env.PORT, () => {
    console.log('Servidor rodando na porta 3000');
});
