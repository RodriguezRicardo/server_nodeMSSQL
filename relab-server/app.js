const express = require('express');
const app = new express();

//Importo la classe per le chiamate al DB
const sqlUtils = require('./SqlUtils.js');

const CC = require('./CoordConverter.js');
const coordConverter =  new CC();

app.get('/', function (req, res) {
   //Per connettermi al DB uso il metodo statico sqlUtils.connect
   //Passo come parametro la funzione sqlUtils.makeSqlRequest che verrà lanciata 
   //se la connessione al DB avrà successo  
   sqlUtils.connect(res, sqlUtils.makeSqlRequest);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
