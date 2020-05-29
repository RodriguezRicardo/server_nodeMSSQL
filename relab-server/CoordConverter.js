const proj4 = require('proj4');
const parse = require('wellknown');
const Feature = require('./models/feature.model.js');
const FeatureCollection = require('./models/featureCollection.model.js');

module.exports = class CoordConverter {
    constructor()
    {
        //Definisco il tipo di proiezioni da convertire (32632->4362)
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        //proj4.defs("EPSG:4362", "già definito in proj4");
    }

    //Modificato 04.3
    //Riceve come parametro il recordset estratto dal DB 
    generateGeoJson(recordset) {
        let geoJsonHeader = new FeatureCollection(); //Crea la Featurecollection
        let i = 0;
        for (const record of recordset) {  
            //in ogni riga del nonstro recordset, prendiamo la media e la somma
            let media = record["media"];
            let somma = record["somma"];

            let polygonGeometry = parse(record["WKT"]); //parso da wkt a geojson geometry

            //let geom = this._convertPolygon(polygonGeometry);  converto in "WSG 84" 
            let geom = (polygonGeometry); // non converto più in "WGS 84" 
            
            // e metto la geometry  geojson
            //quando creo la feature , gli passo la media e la somma
            geoJsonHeader.features.push(new Feature(i,geom, media, somma));
            i++;
            //per ogni poligono nel recordset crea una Feature 
        }
        return geoJsonHeader;
    }

    //Converte una geometry coordinata per coordinata con proj4
    _convertPolygon(geometry) {
        let polygon = geometry.coordinates[0];
        for (let index = 0; index < polygon.length; index++) {
            const coord = polygon[index];
            geometry.coordinates[0][index] = proj4("EPSG:32632", "WGS84").forward(coord);
        }
        return geometry;
    }

}
