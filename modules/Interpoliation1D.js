const fs = require("fs");
const path = require("path");
const util = require("util");
const DoBSInterpolation = require("./BSplineInterpolation.js");
class Interpolation1D {
    #phi;
    #la;
    #fileName;
    #shiftValue1;
    #nc = new Array(17);
    #ff = new Array(17);
    constructor(cphi, cla, cFileName) {
        this.#phi = cphi;
        this.#la = cla;
        this.#fileName = cFileName;
    }
    get GetShiftValues() {
        return this.#shiftValue1;
    }
    get GetFF() {
        return this.#ff;
    }
    get GetNC() {
        return this.#nc;
    }
    readFP(start) {
        let a, b, c, d, e, f, g, h;
        let binaryFile = fs.readFileSync(
            //TODO - MAKE THIS REFERABLE TO THE NEEDED GRC FILE
            `./GISDATA/${this.#fileName}`
        );
        binaryFile = binaryFile.slice(start, start + 8);
        a = binaryFile.readInt8(0);
        b = binaryFile.readInt8(1);
        c = binaryFile.readInt8(2);
        d = binaryFile.readInt8(3);
        e = binaryFile.readInt8(4);
        f = binaryFile.readInt8(5);
        g = binaryFile.readInt8(6);
        h = binaryFile.readInt8(7);
        return Buffer.from([h, g, f, e, d, c, b, a]).readDoubleBE();
    }

    LoadArrays() {
        let xk, yk; // xk - East, yk - North
        let nrjx, nodcolx, nodliny;
        let minE, maxE, minN, maxN, stepE, stepN;

        minE = this.readFP(0);
        maxE = this.readFP(8);
        minN = this.readFP(16);
        maxN = this.readFP(24);
        stepE = this.readFP(32);
        stepN = this.readFP(40);
        nrjx = Math.round((maxE - minE) / stepE + 1);
        if (
            this.#la <= minE + stepE ||
            this.#la >= maxE - stepE ||
            this.#phi <= minN + stepN ||
            this.#phi >= maxN - stepN
        ) {
            //NEEDS error handling
            return -1;
        }
        nodcolx = Math.abs(Math.round(parseInt((this.#la - minE) / stepE)));
        nodliny = Math.abs(Math.round(parseInt((this.#phi - minN) / stepN)));
        xk = minE + nodcolx * stepE;
        yk = minN + nodliny * stepN;
        //Relative coornates of point x
        xk = (this.#la - xk) / stepE;
        yk = (this.#phi - yk) / stepN;

        //{Parameters of bicubic spline surface}
        this.#ff[1] = 1;
        this.#ff[2] = xk;
        this.#ff[3] = xk * xk;
        this.#ff[4] = xk * xk * xk;
        this.#ff[5] = yk;
        this.#ff[6] = xk * yk;
        this.#ff[7] = xk * xk * yk;
        this.#ff[8] = xk * xk * xk * yk;
        this.#ff[9] = yk * yk;
        this.#ff[10] = xk * yk * yk;
        this.#ff[11] = xk * xk * yk * yk;
        this.#ff[12] = xk * xk * xk * yk * yk;
        this.#ff[13] = yk * yk * yk;
        this.#ff[14] = xk * yk * yk * yk;
        this.#ff[15] = xk * xk * yk * yk * yk;
        this.#ff[16] = xk * xk * xk * yk * yk * yk;

        //{Positions in grid file}
        this.#nc[6] = nodliny * nrjx + nodcolx + 1;
        this.#nc[1] = (nodliny - 1) * nrjx + nodcolx;
        this.#nc[2] = (nodliny - 1) * nrjx + nodcolx + 1;
        this.#nc[3] = (nodliny - 1) * nrjx + nodcolx + 2;
        this.#nc[4] = (nodliny - 1) * nrjx + nodcolx + 3;
        this.#nc[5] = nodliny * nrjx + nodcolx;
        this.#nc[7] = nodliny * nrjx + nodcolx + 2;
        this.#nc[8] = nodliny * nrjx + nodcolx + 3;
        this.#nc[9] = (nodliny + 1) * nrjx + nodcolx;
        this.#nc[10] = (nodliny + 1) * nrjx + nodcolx + 1;
        this.#nc[11] = (nodliny + 1) * nrjx + nodcolx + 2;
        this.#nc[12] = (nodliny + 1) * nrjx + nodcolx + 3;
        this.#nc[13] = (nodliny + 2) * nrjx + nodcolx;
        this.#nc[14] = (nodliny + 2) * nrjx + nodcolx + 1;
        this.#nc[15] = (nodliny + 2) * nrjx + nodcolx + 2;
        this.#nc[16] = (nodliny + 2) * nrjx + nodcolx + 3;
        return 0;
    }
    DoInterpolation() {
        let error = 0;
        let az = new Array(17);
        let value = 0;
        let outside = 0;
        error = this.LoadArrays();

        if (!error) {
            try {
                for (let ii = 1; ii <= 16; ii++) {
                    value = this.readFP(this.#nc[ii] * 8 - 8 + 48);
                    console.log(value);
                    if (Math.round(parseInt(value)) == 999) {
                        outside = -1;
                    }
                    az[ii] = value;
                }
            } catch (exception) {
                console.warn(exception);
                return -1;
            }
            if (outside != 0) {
                console.warn("Outside the border");
                return -1;
            }
            let bsi = new BSplineInterpolation();
            bsi.DoBSInterpolation(this.#ff, az);
            this.#shiftValue1 = bsi.GetShiftValue();
        } else {
            return -1;
        }
    }
}
class Interpolation2D extends Interpolation1D {
    fileName;
    constructor(cEast, cNorth, cFileName) {
        super(cNorth, cEast, cFileName);
        this.fileName = cFileName;
        let shiftValueE, shiftValueN;
    }
    get ShiftValueE() {
        return this.shiftValueE;
    }
    get ShiftValueN() {
        return this.shiftValueN;
    }
    DoInterpolation() {
        let error = 0;
        let ax = new Array(17);
        let ay = new Array(17);
        let value = 0;
        let outside = 0;

        error = this.LoadArrays();
        if (!error) {
            try {
                for (let ii = 1; ii <= 16; ii++) {
                    value = this.readFP(super.GetNC[ii] * 16 - 16 + 48);
                    console.log(value);
                    if (Math.round(parseInt(value)) == 999) {
                        outside = -1;
                    }
                    ax[ii] = value;
                    value = this.readFP(super.GetNC[ii] * 16 - 8 + 48);
                    if (Math.round(parseInt(value)) == 999) {
                        outside = -1;
                    }
                    ay[ii] = value;
                }
            } catch (error) {
                console.warn(error);
                return -1;
            }
            if (outside != 0) {
                console.warn("Error: Outside of borderd.");
                return -1;
            }
            this.shiftValueE = DoBSInterpolation(this.GetFF, ax);
            this.shiftValueN = DoBSInterpolation(this.GetFF, ay);
            let s = 0;
        } else {
            return -1;
        }
        return 0;
    }
}
module.exports = { Interpolation1D, Interpolation2D };
