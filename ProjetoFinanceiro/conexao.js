const mysql = require('mysql2')
require('dotenv').config()

const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

conexao.connect((err) => {
    if (err) {
        console.log("Erro ao conectar")
        return
    }
    console.log("Banco conectado")
})


sql1 = `
 create table if not exists categorias (
	id int auto_increment primary key,
    nome varchar(100) not null,
    tipo enum('RECEITA','DESPESA') not null
)
`

sql2 = `
 create table if not exists lancamentos (
	id int auto_increment primary key,
    descricao varchar(150) not null,
    valor decimal(10,2) not null,
    tipo enum('RECEITA','DESPESA') not null,
    data_lancamento date not null,
    categoria_id int not null,
    
    constraint fk_categoria
		foreign key (categoria_id)
        references categorias(id)
)
`

conexao.query(sql1, (err) => {
    if (err) {
        console.log("Erro ao criar a tabela", err)
        return
    }
    console.log("Tabela criada")
})

conexao.query(sql2, (err) => {
    if (err) {
        console.log("Erro ao criar a tabela", err)
        return
    }
    console.log("Tabela criada")
})

module.exports = conexao