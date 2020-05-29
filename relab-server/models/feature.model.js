//Classe utile a rappresentare le feature degli oggetti geojson
module.exports = class Feature{
    //aggiunto media e somma 04.3
    constructor(id, geometry, media, somma) {
        this.type = "Feature";
        //aggiunto anche qui 04.3
        this.properties = new Properties(id, media, somma); //Per ora le proprietà contengono un solo valore (id)
        this.geometry = geometry; //Contiene la geometria del poligono.
    }
}


//Iniziamo a preparare la classe Properties che complicheremo in seguito
//modificato Properties 04.3
class Properties
{
    constructor(id, media, somma)
    {
        this.id = id;
        this.media = media;
        this.somma = somma;
    }
}
