const express = require('express')
const conexao = require('./conexao')

const app = express()
app.use(express.json())

app.post('/categoria', (req, res) => {
    const { nome, tipo } = req.body

    const sql = `insert into categorias (nome, tipo) values (?,?)`

    conexao.query(sql, [nome, tipo], (err) => {
        if (err) {
            console.log("Erro ao salvar", err)
            return res.status(500).json({ erro: "Erro ao cadastrar" })
        }
        res.status(200).json({ mensagem: "ategoria cadastrada" })
    })
})

app.post('/lancamento', (req, res) => {
    const { descricao, valor, tipo, data_lancamento, categoria_id } = req.body

    const sql = `insert into lancamentos (descricao ,valor, tipo, data_lancamento, categoria_id) values (?,?,?,?,?)`

    conexao.query(sql, [descricao, valor, tipo, data_lancamento, categoria_id], (err) => {
        if (err) {
            console.log("Erro ao salvar", err)
            return res.status(500).json({ erro: "Erro ao cadastrar" })
        }
        res.status(200).json({ mensagem: "lançamento feito" })
    })
})

app.get('/categoria', (req, res) => {
    const sql = `select * from categorias`

    conexao.query(sql, (err, result) => {
        if (err) {
            console.error("Erro ao buscar", err)
            return res.status(500).json({ erro: "Erro ao buscar categorias registradas" })
        }
        res.status(200).json(result)
    })
})

app.get('/lancamento', (req, res) => {
    const sql = `select * from lancamentos`

    conexao.query(sql, (err, result) => {
        if (err) {
            console.error("Erro ao buscar", err)
            return res.status(500).json({ erro: "Erro ao buscar categorias registradas" })
        }
        res.status(200).json(result)
    })
})

app.put('/categoria/:id', (req, res) => {
    const { id } = req.params
    const { nome, tipo } = req.body

    const sql = `update categorias set nome = ?, tipo = ? where id = ?`

    conexao.query(sql, [nome, tipo, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json({ mensagem: "categoria atualizada", id })
    })
})
app.put('/lancamento/:id', (req, res) => {
    const { id } = req.params
    const { descricao, valor, tipo, data_lancamento } = req.body

    const sql = `update lancamentos set descricao = ?, valor = ?, tipo = ?, data_lancamento = ? where id = ?`

    conexao.query(sql, [descricao, valor, tipo, data_lancamento, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json({ mensagem: "lancamento atualizado", id })
    })
})

app.delete('/categoria/:id', (req, res) => {
    const { id } = req.params

    sql = `delete from categorias where id = ?`

    conexao.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(200).json({ mensagem: "Deletado com sucesso", id })
    })
})
app.delete('/lancamento/:id', (req, res) => {
    const { id } = req.params

    sql = `delete from lancamentos where id = ?`

    conexao.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(200).json({ mensagem: "Deletado com sucesso", id })
    })
})

app.listen(3000, () => {
    console.log("Servidor em 3000")
})