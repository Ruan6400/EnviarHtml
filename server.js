const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const {Pool} = require('pg');
require('dotenv').config();
const port = process.env.HOST_PORT;



const conexao_banco = {
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
}

const storage = {storage:multer.memoryStorage()}
//iniciando servidor
const app = express();


//Converter as solicitções post em arquivos json
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/*o body-parser era pras versões mais antigas do express (antes do 4.16)
agora você pode usar apenas o "app.use(express.urlencoded({extended:true}));"
*/

//acessando banco de dados padrão
const pool = new Pool(conexao_banco);
function CreateDatabase(){
    try{
        pool.query(`
            CREATE TABLE IF NOT EXISTS cadastro(
                id SERIAL PRIMARY KEY,
                nome VARCHAR(50),
                email VARCHAR(50)    
            );
            `)
        console.log("Tabela criada")
    }catch(erro){
        console.log("Deu ruim");
        console.error(erro);
    }
}
CreateDatabase();

app.post('/enviar',(req,res)=>{
    const {nome,email} = req.body;
    pool.query(`INSERT INTO cadastro (nome,email)
        values($1,$2)`,[nome,email]);
        res.send(`Dados enviados`);

})

app.get('/',(req,res)=>{
    res.redirect('127.0.0.1:5500/index.html')
})

//função p
//Deixando o servidor pronto
app.listen(port,()=>{
    console.log("Servidor rodando na porta: "+port);
})

