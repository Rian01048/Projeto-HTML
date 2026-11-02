const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const conexao = require('./conexao')

const app = express()
app.use(express.json())
app.use(cors())

app.post('/usuarios', (req, res) => {
    const { nomeCompleto, email, telefone, senha } = req.body

    const sql = `insert into cadastros (nomeCompleto, email, telefone, senha) value (?,?,?,?)`

    conexao.query(sql, [nomeCompleto, email, telefone, senha], (err) => {
        if (err) {
            console.error("Erro ao salvar registro: ", err)
            return res.status(500).json({ erro: 'Erro ao cadastrar!' })
        }
        res.status(201).json({ mensagem: 'Usuario cadastrado' })
    })
})


app.use('/uploads', express.static('uploads'));
const armazem = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: armazem });

app.post('/pets', upload.single('foto'), (req, res) => {
    const { nome, especie, situacao, preco, bairro, cidade, telefone } = req.body;

    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `INSERT INTO Pets (nome, especie, situacao, preco, bairro, cidade, telefone, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    conexao.query(sql, [nome, especie, situacao, preco, bairro, cidade, telefone, fotoUrl], (err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao salvar o pet.' });
        res.status(201).json({ mensagem: 'Pet publicado com sucesso!' });
    })
})


app.post('/login', (req, res) => {
    const { email, senha } = req.body
    const sql = 'select * from cadastros where email = ? and senha = ?'

    conexao.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error("Erro ao realizar login: ", err)
            return res.status(500).json({ erro: "Erro interno" })
        }

        if (results.length > 0) {
            res.status(200).json({ mensagem: 'Login realizado' })
        } else {
            res.status(401).json({ erro: 'Email ou senha incorretos' })
        }
    })
})


app.get('/pets', (req, res) => {
    const sql = 'select * from pets'

    conexao.query(sql, (err, result) => {
        if (err) {
            console.error("Erro ao buscar", err)
            return res.status(500).json({ erro: "Erro ao buscar pets cadastrados" })
        }
        res.status(200).json(result)
    })
})

app.delete('/pets/:id', (req, res) => {
    const idPet = req.params.id;
    const sql = 'DELETE FROM Pets WHERE id = ?';

    conexao.query(sql, [idPet], (err, result) => {
        if (err) {
            console.error("Erro ao excluir pet: ", err);
            return res.status(500).json({ erro: 'Erro ao excluir o pet.' });
        }
        res.status(200).json({ mensagem: 'Pet excluído com sucesso!' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})