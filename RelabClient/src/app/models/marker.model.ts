export class Marker {
    icon = {}
   //Quando creo un nuovo marker e verifico quale label viene passata al costruttore, se contiene il testo
   //“Gas naturale” o “Energia elettrica” (abbreviati in Gas e Elettrica) imposto l’icona e cancello
   //l’etichetta
    constructor(public lat: number, public lng: number, public label?: string)
    {
        if(this.label.includes("Gasolio"))
        {
            this.icon = { url: './assets/img/gasol.ico' };
            this.label = "";
            return;   //quando trova Gasolio esce dal metodo e non va su Gas
        }
        if (this.label.includes("Gas")) {
            this.icon = { url: './assets/img/gas-32.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("elettrica"))
        {
            this.icon = { url: './assets/img/electricity-32.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("NULL"))
        {
            this.icon = { url: './assets/img/valNull-32.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("Biomasse solide"))
        {
            this.icon = { url: './assets/img/biomassSolid-32.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("Biomasse liquide"))
        {
            this.icon = { url: './assets/img/biomassLiquidGas.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("Teleriscaldamento"))
        {
            this.icon = { url: './assets/img/teleriscaldamento-32.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("GPL"))
        {
            this.icon = { url: './assets/img/gpl.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("RSU"))
        {
            this.icon = { url: './assets/img/rsu-32.ico' };
            this.label = "";
            return;
        }
        if(this.label.includes("Olio"))
        {
            this.icon = { url: './assets/img/oil.ico' };
            this.label = "";
            return;
        }
    }
}
