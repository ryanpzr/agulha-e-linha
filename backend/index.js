const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const server = express();

const corsOptions = {
    origin: 'https://agulha-e-linha.up.railway.app',  // Atualize com o seu domínio
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

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploadsImagens/'); // Especifica o diretório onde as imagens serão armazenadas
        },
        filename: function (req, file, cb) {
            // Define o nome do arquivo de imagem carregado
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    const upload = multer({ storage: storage }).single('foto');

    server.post('/upload', upload, async (req, res) => {
        const { nome, subnome, preco, subpreco } = req.body;
        const foto = req.file;
    
        if (!foto) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }
    
        // Salvar apenas o caminho da imagem no banco de dados
        const caminhoImagem = path.join('uploadsImagens', foto.filename);
    
        const sql = 'INSERT INTO bonecas (nome, subnome, preco, subpreco, foto) VALUES (?, ?, ?, ?, ?)';
        const values = [nome, subnome, preco, subpreco, caminhoImagem];
    
        try {
            const [result] = await connection.execute(sql, values);
            console.log('Boneca inserida com sucesso no banco de dados');
            const novaBoneca = { nome, subnome, preco, subpreco, foto: caminhoImagem, id: result.insertId };
            return res.json(novaBoneca);
        } catch (err) {
            console.error('Erro ao inserir boneca no banco de dados:', err);
            return res.status(500).json({ error: 'Erro ao salvar a boneca' });
        }
    });

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