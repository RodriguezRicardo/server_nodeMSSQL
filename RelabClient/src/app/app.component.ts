import { Component, OnInit } from '@angular/core';

import { GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ci_vettore } from './models/ci_vett.model';
import { Marker } from './models/marker.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'RelabClient';

  // google maps zoom level
  zoom: number = 12;
  geoJsonObject: GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
  fillColor: string = "#FF0000";  //Colore delle zone catastali
  obsGeoData: Observable<GeoFeatureCollection>;
  lng: number = 9.205331366401035;
  lat: number = 45.45227445505016;

  obsCiVett : Observable<Ci_vettore[]>; //Crea un observable per ricevere i vettori energetici
  markers: Marker[];


  constructor(public http: HttpClient) {
  //Facciamo iniettare il modulo HttpClient dal framework Angular (ricordati di importare la libreria)
  }

  //Metodo che scarica i dati nella variabile geoJsonObject
  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    console.log( this.geoJsonObject);
  }

  //Metodo che riceve i dati e li aggiunge ai marker
  prepareCiVettData = (data: Ci_vettore[]) =>
  {
    let latTot = 0;   //Uso queste due variabili per calcolare latitudine e longitudine media
    let lngTot = 0;   //E centrare la mappa

    console.log(data); //Verifica di ricevere i vettori energetici
    this.markers = [];
    for (const iterator of data) { //Per ogni oggetto del vettore creo un Marker
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);

      latTot += m.lat; //Sommo tutte le latitutidini e longitudini
      lngTot += m.lng;

      this.markers.push(m);
    }
    this.lng = lngTot/data.length;  //commenta
    this.lat = latTot/data.length;
    this.zoom = 16;
  }

  //Una volta che la pagina web è caricata, viene lanciato il metodo ngOnInit scarico i dati
  //dal server
  ngOnInit() {
    //esegue una richiesta get all'url del server e ritorna i dati di tipo GeoFeatureCollection
    this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-a688c0e6-bc96-4d5d-af33-40a86a65b59b.ws-eu01.gitpod.io");   //l’url che uso per testare il server
    //ci sottoscriviamo e si lancia il metodo prepareData
    this.obsGeoData.subscribe(this.prepareData);

    //Rimosso la chiamata http a `MIO_URL/ci_vettore/${val}`
  }

  cambiaFoglio(foglio) : boolean
  {
    let val = foglio.value;    //Commenta
    //passo la var 'val' che contiene il valore del foglio
    this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-a688c0e6-bc96-4d5d-af33-40a86a65b59b.ws-eu01.gitpod.io/ci_vettore/${val}`);
    this.obsCiVett.subscribe(this.prepareCiVettData);     //Commenta
    console.log(val);
    return false;
  }


  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.fillColor,
      strokeWeight: 1
    });
  }
}
