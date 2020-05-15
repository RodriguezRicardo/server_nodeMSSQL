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
    console.log(data); //Verifica di ricevere i vettori energetici
    this.markers = [];
    for (const iterator of data) { //Per ogni oggetto del vettore creo un Marker
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      this.markers.push(m);
    }
  }

  //Una volta che la pagina web è caricata, viene lanciato il metodo ngOnInit scarico i dati
  //dal server
  ngOnInit() {
    this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-d23ce09d-6e75-4444-832b-f56337d6bdde.ws-eu01.gitpod.io");   //l’url che uso per testare il server
    this.obsGeoData.subscribe(this.prepareData);

    //Visualizzare i vettori energetici

    //Effettua la chiamata al server per ottenere l’elenco dei vettori energetici
    this.obsCiVett = this.http.get<Ci_vettore[]>("https://3000-d23ce09d-6e75-4444-832b-f56337d6bdde.ws-eu01.gitpod.io/ci_vettore/90");
    this.obsCiVett.subscribe(this.prepareCiVettData);
  }

  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.fillColor,
      strokeWeight: 1
    });
  }

}
