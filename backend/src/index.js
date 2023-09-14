const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); // Importe o módulo MySQL2

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'dbApiBonecas'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados MySQL');
    }
});

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/bonecas', (req, res) => {
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

server.delete('/bonecas', (req, res) => {
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

server.post('/bonecas', (req, res) => {
    const { nome, subnome, preco, subpreco } = req.body;
    const novaBoneca = { nome, subnome, preco, subpreco };

    // Insira a nova boneca no banco de dados
    const sql = 'INSERT INTO bonecas (nome, subnome, preco, subpreco) VALUES (?, ?, ?, ?)';
    const values = [novaBoneca.nome, novaBoneca.subnome, novaBoneca.preco, novaBoneca.subpreco];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir boneca no banco de dados:', err);
            return res.status(500).json({ error: 'Erro ao salvar a boneca' });
        } else {
            console.log('Boneca inserida com sucesso no banco de dados');
            novaBoneca.id = result.insertId; // Obtenha o ID gerado para a boneca

            // Envie uma resposta com a nova boneca, incluindo o ID gerado
            return res.json(novaBoneca);
        }
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
