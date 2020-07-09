const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());

//O CORS (compartilhamento de recursos de origem cruzada) é um recurso HTML5 que permite que um site acesse os recursos de outro site, apesar de estar sob nomes de domínio diferentes.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// Cria conexão com o banco
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwe123',
    database: 'crud_jedi',
    multipleStatements: true
});

// Mostra se obteve sucesso ao conectar com o banco
db.connect((err) => {
    if(!err) console.log('DB conectado com sucesso!');
    else console.log('DB conexão falhou \n Error: ' + JSON.stringify(err, undefined, 2));
});

// A porta do servidor
app.listen(3000, () => console.log('Express server rodando na porta no. 3000'));

// Criar DB : desabilitar database: 'crud_jedi'
app.get('/criardb', (req, res) => {
    let sql = 'CREATE DATABASE crud_jedi';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Banco de dados criado');
    });
});

// Criar tabela
app.get('/criartabelaprojeto', (req, res) => {
    let sql = `DROP TABLE IF EXISTS projeto;\
                CREATE TABLE projeto(id int(10) NOT NULL AUTO_INCREMENT,\
                nome varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\
                data_inicio date DEFAULT NULL,\
                data_termino date DEFAULT NULL,\
                valor double DEFAULT NULL,\
                risco int DEFAULT NULL,\
                participantes varchar(600) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\
                PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
        res.send('Tabela de projeto criada');
    });
});

// Ler todos os projetos
app.get('/projetos', (req, res) => {
    var sql = 'SELECT * FROM projeto';
    db.query(sql, (err, rows, fields) => {
        if(!err) res.send(rows);
        else console.log(err);
        //console.log(results);
    });
});

// Ler 1 projeto
app.get('/projetos/:id', (req, res) => {
    var sql = 'SELECT * FROM projeto WHERE id = ?';
    db.query(sql, [req.params.id], (err, rows, fields) => {
        if(!err) res.send(rows);
        else console.log(err);
    });
});

// Deleter projeto
app.delete('/deletarprojeto/:id', (req, res) => {
    var sql = 'DELETE FROM projeto WHERE id = ?';
    db.query(sql, [req.params.id], (err, rows, fields) => {
        if(!err) res.send('Deletado com sucesso.');
        else console.log(err);
    })
});

// Criar projeto
app.post('/addprojeto', (req, res) => {
    let proj = req.body;
    let projeto = {
                nome: proj.nome, 
                data_inicio: proj.data_inicio, 
                data_termino: proj.data_termino, 
                valor:proj.valor, 
                risco:proj.risco, 
                participantes:proj.participantes
            }
    let sql = 'INSERT INTO projeto SET ?';
    db.query(sql, projeto, (err, rows, fields) => {
        if(!err) res.send('Projeto adicionado com sucesso!');
        else console.log(err);
    })
});

// Editar projeto
app.get('/editarprojeto/:id', (req, res) => {
    // Trazer todos os parâmetros e dar update em todos, por mais que seja modificado somente 1
    let proj = req.body;
    var sql = `UPDATE projeto SET nome = '${proj.nome}', data_inicio = '${proj.data_inicio}', data_termino = '${proj.data_termino}', \
                valor = '${proj.valor}', risco = '${proj.risco}', participantes = '${proj.participantes}' WHERE id = ${req.params.id}`; 
    db.query(sql, (err, rows, fields) => {
        if(!err)
            res.send('Editado com sucesso');
        else throw err;
    })
});
