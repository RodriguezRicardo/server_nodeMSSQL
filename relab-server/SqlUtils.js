const sql = require('mssql');
const CC = require('./CoordConverter.js');

const coordConverter = new CC();

const config = {
    user: 'PCTO',  //Vostro user name
    password: 'xxx123#', //Vostra password
    server: "213.140.22.237",  //Stringa di connessione
    database: 'Katmai', //(Nome del DB)
}

module.exports = class SqlUtils {

    //dato che il metodo connect richiama il metodo connectCallback deve ottenere il parametro req
    static connect(req, res, connectedCallback)
    {
        sql.connect(config, (err) => {
            if (err) console.log(err);  // ... error check
            else connectedCallback(req, res);     //callback da eseguire in caso di connessione avvenuta 
            //aggiunto req
        });
    }

    //modificato 04.3
    //makeSqlRequest esegue una query sul db, se la query va a buon fine viene richiamata la funzione di //callback che invoca il metodo sendQuery
    //Anche makeSqlRequest è una callback richiamata da connect, dobbiamo aggiungere solo il parametro req
    static makeSqlRequest(req, res) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let q = 'SELECT DISTINCT TOP (100) [WKT] FROM [Katmai].[dbo].[intMil4326WKT]';
        //mod. la tabella intMil. in tutte le query
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, result) => {SqlUtils.sendQueryResults(err,result,res)}); 
    }
    
    static sendQueryResults(err,result, res)
    {
        if (err) console.log(err); // ... error checks
        res.send(coordConverter.generateGeoJson(result.recordset));  //Invio il risultato al Browser
    }

    static ciVettRequest(req, res) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let foglio = req.params.foglio; //ottengo il foglio passato come parametro dall'url

        let q = `SELECT INDIRIZZO, WGS84_X, WGS84_Y, CLASSE_ENE, EP_H_ND, CI_VETTORE, FOGLIO, SEZ
        FROM [Katmai].[dbo].[intMil4326WKT]  
        WHERE FOGLIO = ${foglio}`

        //eseguo la query e aspetto il risultato nella callback
       sqlRequest.query(q, (err, result) => {SqlUtils.sendCiVettResult(err,result,res)}); 
    }

    static sendCiVettResult(err,result, res)
    {
        if (err) console.log(err); // ... error checks
        res.send(result.recordset);  //Invio il risultato al Browser
    }

    static ciVettGeoRequest(req, res) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let x = Number(req.params.lng);      //ottiene longitudine
        let y = Number(req.params.lat);      //ottiene latitudine
        let r = Number(req.params.r);        //ottiene raggio

        //query che serve per ricercare tutte le abitazioni in quel cerchio.
        let q = `SELECT INDIRIZZO, WGS84_X, WGS84_Y, CLASSE_ENE, EP_H_ND, CI_VETTORE, FOGLIO, SEZ
        FROM [Katmai].[dbo].[intMil4326WKT]
        WHERE WGS84_X > ${x} - ${r} AND      
        WGS84_X < ${x} + ${r} AND
        WGS84_Y > ${y} - ${r} AND 
        WGS84_Y < ${y} + ${r}`

        /*new_x > x-r
        new_x < x+r
        new_y > y-r
        new_y < y+r */

        console.log(q);
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, result) => {SqlUtils.sendCiVettResult(err,result,res)});
    }

    //nuovo metodo creato 04.3
    static geoGeomRequest(req, res) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let x = Number(req.params.lng);
        let y = Number(req.params.lat);
        let r = Number(req.params.r);
        let q = `
        SELECT SUM(EP_H_ND) as somma, AVG(EP_H_ND) as media, [WKT] , SEZ
        FROM [Katmai].[dbo].[intMil4326WKT]
        WHERE EP_H_ND > 0 AND SEZ in(
            SELECT DISTINCT SEZ
            FROM [Katmai].[dbo].[intMil4326WKT]
            WHERE WGS84_X > ${x} - ${r} AND 
                  WGS84_X < ${x} + ${r} AND
                  WGS84_Y > ${y} - ${r} AND 
                  WGS84_Y < ${y} + ${r})
        GROUP BY [WKT], SEZ`
        //otterrò la somma e la media all'interno del cerchio
        //console.log(q);
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, result) => { SqlUtils.sendQueryResults(err, result, res) });
    }
}
