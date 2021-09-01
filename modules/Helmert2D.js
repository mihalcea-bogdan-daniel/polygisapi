class Helmert2D {
    constructor(ctE, ctN, cdm, cRz) {
        this.tE = ctE;
        this.tN = ctN;
        this.dm = cdm;
        this.Rz = cRz;
    }
    DoTransformation(Easts, Norths) {}
}

module.exports = Helmert2D;
