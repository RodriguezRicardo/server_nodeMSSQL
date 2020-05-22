export class Icon {    //creo la classe Icon per poter ridimensionare a piacimento l'icone
  public scaledSize:ScaledSize;
    constructor(public url: string, size: number){
        this.scaledSize = new ScaledSize(size,size);
    }

    setSize(size: number) { //metodo per poter assegnare una nuova grandezza alla icona
        this.scaledSize = new ScaledSize(size,size);
    }
}

export class ScaledSize { //classe per dare altezza e larghezza dell'immagine. Poi si richiama nella classe Icon
    constructor(
    public width:  number,
    public height: number){}
}
