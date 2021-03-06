const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;

(async () => {
    


const connectionString = 'mongodb+srv://admin:12345@cluster0.mh1st.mongodb.net/ocean_mongodb?retryWrites=true&w=majority';
console.info('Conectando ao banco de dados...');

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

console.info('MongoDB conectado com sucesso!');

const app = express();

const port = process.env.PORT || 3000;

// Precisamos avisar o Express para utilizar o body-parser
// Assim, ele saberá como transformar as informações no BODY da requisição
//      em informação útil para a programação

app.use(bodyParser.json());

/*
-> Create, Read (All/Single), Update & Delete
-> Criar, Ler (Tudo ou Individual), Atualizar e Remover
*/

/*
URL -> http://localhost:3000
Endpoint ou Rota -> [GET] /mensagem
Endpoint ou Rota -> [POST] /mensagem

Endpoint: [GET] /mensagem
Descrição: Ler todas as mensagens

Endpoint: [POST] /mensagem
Descrição: Criar uma mensagem

Endpoint: [GET] /mensagem/{id}
Descrição: Ler mensagem específica pelo ID
Exemplo: [GET] /mensagem/1

Endpoint: [PUT] /mensagem/{id}
Descrição: Edita mensagem específica pelo ID

Endpoint: [DELETE] /mensagem/{id}
Descrição: Remove mensagem específica pelo ID
*/
 
app.get('/', function (req, res) {
  res.send('Hello World')
});

const db = client.db('ocean_mongodb');
const mensagens = db.collection('mensagens')

//Read All
app.get('/mensagem', async function(req, res){
    const findResult = await mensagens.find({}).toArray();
    res.send(findResult);
});

//create
app.post('/mensagem', async function(req, res){
    const texto = req.body.texto;

    const mensagem = {
        texto
    }

    const resultado = await mensagens.insertOne(mensagem)
    const objetoInserido = resultado.ops[0];

    res.send(objetoInserido);

});

//Read Single
app.get('/mensagem/:id', async function(req, res){
    const id = req.params.id;

    const mensagem = await mensagens.findOne({_id: ObjectID(id)})

    res.send(mensagem);
});

//Update
app.put('/mensagem/:id', async function(req, res){
    const id = req.params.id;

    const mensagem = {
        _id: ObjectID(id),
        ...req.body
    };

    await mensagens.updateOne(
        { _id: ObjectID(id)},
        {$set: mensagem}
    );

    res.send(mensagem);
});

//Delete
app.delete('/mensagem/:id', async function(req, res){
    const id = req.params.id;

    await mensagens.deleteOne({ _id: ObjectID(id) })

    res.send(`A mensagem de ID '${id}', foi removida com sucesso.`);
});

app.listen(port, function(){
    console.info('App rodando em http://localhost: ' + port)
});

})();