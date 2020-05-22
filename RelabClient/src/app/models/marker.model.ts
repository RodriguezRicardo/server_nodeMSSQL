import { Icon } from './icon.model';

export class Marker {
  icon : Icon;
  //Quando creo un nuovo marker e verifico quale label viene passata al costruttore, se contiene il testo
  //“Gas naturale” o “Energia elettrica” (abbreviati in Gas e Elettrica) imposto l’icona e cancello
  //l’etichetta
  constructor(public lat: number, public lng: number, public label?: string)
  {
    if(this.label.includes("Gasolio"))
    {
      this.icon = new Icon ( './assets/img/gasol.ico', 24);
      this.label = "";
      return;   //quando trova Gasolio esce dal metodo e non va su Gas
    }
    if (this.label.includes("Gas"))
    {
      this.icon = new Icon ( './assets/img/gas-32.ico', 24);
      this.label = "";
      return;
    }
    if(this.label.includes("elettrica"))
    {
      this.icon = new Icon ( './assets/img/electricity-32.ico', 24);
      this.label = "";
      return;
    }
    if(this.label.includes("NULL"))
    {
      this.icon = new Icon ( './assets/img/valNull-32.ico', 24);
      this.label = "";
      return;
    }
    if(this.label.includes("Biomasse solide"))
    {
      this.icon = new Icon ( './assets/img/biomassSolid-32.ico', 24 );
      this.label = "";
      return;
    }
    if(this.label.includes("Biomasse liquide"))
    {
      this.icon = new Icon ( './assets/img/biomassLiquidGas.ico', 24);
      this.label = "";
      return;
    }
    if(this.label.includes("Teleriscaldamento"))
    {
      this.icon = new Icon ( './assets/img/teleriscaldamento-32.ico', 24);
      this.label = "";
      return;
    }
    if(this.label.includes("GPL"))
    {
      this.icon = new Icon ( './assets/img/gpl.ico', 24);
      this.label = "";
      return;
    }
    if(this.label.includes("RSU"))
    {
      this.icon = new Icon ( './assets/img/rsu-32.ico', 24);
      this.label = "";
      return;
    }
    if(this.label.includes("Olio"))
    {
      this.icon = new Icon ( './assets/img/oil.ico', 24);
      this.label = "";
      return;
    }
  }
}
