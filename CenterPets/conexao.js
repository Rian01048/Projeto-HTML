require('dotenv').config()
const mysql = require('mysql2')

const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

conexao.connect((err) => {
    if (err) {
        console.log("Erro de conexão: ", err)
        return
    }
    console.log("onexão feita")
})

const sql1 = `
 create table if not exists cadastros (
    id int auto_increment primary key,
    nomeCompleto varchar(200) not null,
    email varchar(200) not null unique,
    telefone varchar(11),
    senha varchar(45) not null
 )
`

const sql2 = `
 create table if not exists pets (
    id int auto_increment primary key,
    nome varchar(100) not null,
    especie varchar(100) not null,
    situacao varchar(100) not null,
    preco decimal(10,2) default 0,
    bairro varchar(150) not null,
    cidade varchar(150) not null,
    telefone varchar(11) not null,
    foto varchar(255) not null
)
`

conexao.query(sql1, (err) => {
    if (err) throw err
    console.log("Primeira tabela criada")
})

conexao.query(sql2, (err) => {
    if (err) throw err
    console.log("Segunda tabela criada")
})



module.exports = conexao