import { Component, OnInit } from '@angular/core';

import { GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ci_vettore } from './models/ci_vett.model';
import { Marker } from './models/marker.model';

import { MouseEvent } from '@agm/core';

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


  //per fare il cerchio, aggiungo questi attributi
  circleLat : number = 0; //Latitudine e longitudine iniziale del cerchio
  circleLng: number = 0;
  maxRadius: number = 400; //Voglio evitare raggi troppo grossi
  radius : number = this.maxRadius; //Memorizzo il raggio del cerchio


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

      latTot += m.lat; //Sommo tutte le latitudini
      lngTot += m.lng; //Sommo tutte le longitudini

      this.markers.push(m);  //metto marker nel vettore
    }
    /*Una volta ottenuto la latitudine e longitudine, li divido per la lunghezza del vettore.
    Perciò il tot. delle lat e lng diviso la lung. del vettore. Faccio una media di lat e lng, per sapere
    dove centrare la mappa.*/
    this.lng = lngTot/data.length;
    this.lat = latTot/data.length;
    this.zoom = 16;
  }

  //Una volta che la pagina web è caricata, viene lanciato il metodo ngOnInit scarico i dati
  //dal server
  ngOnInit() {
    //esegue una richiesta get all'url del server e ritorna i dati di tipo GeoFeatureCollection
    this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-a363e702-7b8e-41d4-a1ef-77c2de50cdb7.ws-eu01.gitpod.io");   //l’url che uso per testare il server
    //ci sottoscriviamo e si lancia il metodo prepareData
    this.obsGeoData.subscribe(this.prepareData);

    //Rimosso la chiamata http a `MIO_URL/ci_vettore/${val}`
  }

  cambiaFoglio(foglio) : boolean
  {
    let val = foglio.value;    //Assegno alla variabile "val" il valore che c'è nel foglio
    /*Eseguo una richiesta http get di tipo Ci_vettore al server, solo che al posto di passargli un singolo valore scelto,
    lo aggiungo alla variabile "val" che lo conterrà e lo passo al url.*/
    this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-a363e702-7b8e-41d4-a1ef-77c2de50cdb7.ws-eu01.gitpod.io/ci_vettore/${val}`);

    this.obsCiVett.subscribe(this.prepareCiVettData);
    /*Si usa observable e ci sottoscriviamo, ricicliamo il
    metodo prepareCiVettData.(crea i marker con icone).*/

    console.log(val);
    return false;
  }

  //Aggiunto il gestore del metodo mapClicked
  mapClicked($event: MouseEvent) {
    this.circleLat = $event.coords.lat; //Queste sono le coordinate cliccate
    this.circleLng = $event.coords.lng; //Sposto il centro del cerchio qui
    this.lat = this.circleLat; //Sposto il centro della mappa qui
    this.lng = this.circleLng;
    this.zoom = 15;  //Zoom sul cerchio
  }

  //Aggiunto il gestore del metodo radiusChange
  //Ogni volta che si ridimensiona il cerchio, dobbiamo salvare il raggio del cerchio
  circleRedim(newRadius : number){
    console.log(newRadius);           //Posso leggere sulla console il nuovo raggio
    this.radius = newRadius;         //Ogni volta che modifico il cerchio, ne salvo il raggio
  }

  //Aggiunto il gestore del metodo circleDblClick

  circleDoubleClicked(circleCenter)
  {
    console.log(circleCenter);       //Voglio ottenere solo i valori entro questo cerchio
    console.log(this.radius);

    //Quando si fa doppio click sul cerchio, si setta la lat e lng del cerchio al punto dove si clicca
    this.circleLat = circleCenter.coords.lat; //Aggiorno le coordinate del cerchio
    this.circleLng = circleCenter.coords.lng; //Aggiorno le coordinate del cerchio

    //Non conosco ancora le prestazioni del DB, non voglio fare ricerche troppo onerose

    //Se si ha un raggio troppo grande, applicazione si impalla, perche' non si riesce a visualizzare tante
    //informazioni in una sola mappa
    if (this.radius > this.maxRadius)
    {
      console.log("area selezionata troppo vasta sarà reimpostata a maxRadius");
      this.radius = this.maxRadius;
    }
    console.log("raggio in gradi " + (this.radius * 0.00001)/1.1132);
    //Voglio spedire al server una richiesta che mi ritorni tutte le abitazioni all'interno del cerchio




    let raggioInGradi = (this.radius * 0.00001)/1.1132;
    //Posso riusare lo stesso observable e lo stesso metodo di gestione del metodo
    //cambiaFoglio poichè riceverò lo stesso tipo di dati
    //Divido l'url andando a capo per questioni di leggibilità non perchè sia necessario

    //richiesta http
    this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-a363e702-7b8e-41d4-a1ef-77c2de50cdb7.ws-eu01.gitpod.io/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`);
    //si usa observable, ci sottoscriviamo e riutilizziamo il metodo prepareCiVettData(crea i marker con icone)
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
