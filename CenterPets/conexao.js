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

const sql = `
 create table if not exists cadastros (
    id int auto_increment primary key,
    nomeCompleto varchar(200) not null,
    email varchar(200) not null unique,
    telefone varchar(11),
    senha varchar(45) not null
 )
`

conexao.query(sql, (err) => {
    if (err) throw err
    console.log('Tabela criada com sucesso')
})

module.exports = conexao