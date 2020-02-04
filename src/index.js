const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require ('./route');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-quzh8.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors())
app.use(express.json());
app.use(routes);

//métodos : delete, put, get
//tipos de parametros :
//Query Params: req.query (Filtros, ordenação, paginação)
//Route Params: request.params,s (Identifica um recurso alteração ou remoção)
//Body: request.body (dados para criação ou alteração de um registro)

// MongoDB (não-relaciconal)


server.listen(3333);