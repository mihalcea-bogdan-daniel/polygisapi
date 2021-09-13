class Helmert2D {
    constructor(ctE, ctN, cdm, cRz) {
        this.tE = ctE;
        this.tN = ctN;
        this.dm = cdm;
        this.Rz = cRz;
        this.Eastt;
        this.Northt;
    }
    DoTransformation(Easts, Norths) {
        let m = 1 + this.dm * 10 ** -6;
        this.Rz = (this.Rz * Math.PI) / (180 * 3600);
        this.Eastt =
            Easts * m * Math.cos(this.Rz) -
            Norths * m * Math.sin(this.Rz) +
            this.tE;
        this.Northt =
            Norths * m * Math.cos(this.Rz) +
            Easts * m * Math.sin(this.Rz) +
            this.tN;
        return { Eastt: this.Eastt, Northt: this.Northt };
    }
}

module.exports = Helmert2D;
