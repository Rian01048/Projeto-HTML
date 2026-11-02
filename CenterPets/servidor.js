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
    const { nome, especie, situacao, bairro, cidade, telefone } = req.body;

    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `INSERT INTO Pets (nome, especie, situacao, bairro, cidade, telefone, foto) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    conexao.query(sql, [nome, especie, situacao, bairro, cidade, telefone, fotoUrl], (err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao salvar o pet.' });
        res.status(201).json({ mensagem: 'Pet publicado com sucesso!' });
    })
})


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})