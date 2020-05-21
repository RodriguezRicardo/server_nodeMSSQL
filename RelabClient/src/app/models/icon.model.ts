export class Icon {    //Commenta
  public scaledSize:ScaledSize;
    constructor(public url: string, size: number){
        this.scaledSize = new ScaledSize(size,size);
    }

    setSize(size: number) { //Commenta
        this.scaledSize = new ScaledSize(size,size);
    }
}

export class ScaledSize { //Commenta
    constructor(
    public width:  number,
    public height: number){}
}
