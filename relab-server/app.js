const express = require('express');
const app = new express();

const cors = require('cors');

//Importo la classe per le chiamate al DB
const sqlUtils = require('./SqlUtils.js');

const CC = require('./CoordConverter.js');
const coordConverter =  new CC();

app.use(new cors());

app.get('/', function (req, res) {
   //Per connettermi al DB uso il metodo statico sqlUtils.connect
   //Passo come parametro la funzione sqlUtils.makeSqlRequest che verrà lanciata 
   //se la connessione al DB avrà successo  
   sqlUtils.connect(req, res, sqlUtils.makeSqlRequest);
   //anche qui aggiungo req
});

//passo il foglio come parametro nell’url
app.get('/ci_vettore/:foglio', function (req, res) {
    console.log(req.params.foglio);
    //richiamo il metodo che ottiene l'elenco dei vettori energetici
    sqlUtils.connect(req, res, sqlUtils.ciVettRequest);
});

//route per ottenere la lat, lng dal client
app.get('/ci_geovettore/:lng/:lat/:r', function (req, res) {
    console.log(req.params);
    //richiamo il metodo che ottiene l'elenco dei vettori energetici
    sqlUtils.connect(req, res, sqlUtils.ciVettGeoRequest);
});

/*nuova route creata 04.3
per ottenere i dati dal client*/
app.get('/geogeom/:lng/:lat/:r', function (req, res) {
     //richiamo il metodo che ottiene l'elenco dei vettori energetici
    sqlUtils.connect(req, res, sqlUtils.geoGeomRequest);
});

//route per far vedere tutte le zone catastali
app.get('/all_zone', function (req, res) {
    //richiamo il metodo che ottiene tutte le zone catastali
    sqlUtils.connect(req, res, sqlUtils.allZoneRequest);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
