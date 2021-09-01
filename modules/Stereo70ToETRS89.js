const dV = require("./DefaultValues.js");
const { Interpolation2D } = require("./Interpoliation1D");
const Helmert2D = require("./Helmert2D.js");
class StereoToETRS89 {
    #phi;
    #la;
    #h;
    constructor(name) {
        this.name = name;
        console.log(this.name);
    }
    get GetPhi() {
        return this.#phi;
    }
    get GetLa() {
        return this.#la;
    }
    get GetH() {
        return this.#h;
    }
    DoTransformation(East, North, type70or30) {
        let EastS = 0;
        let NorthS = 0;
        let shiftValueE, shiftValueN;
        let NameGrid = "";
        let error = 0;
        if (type70or30 == 70) {
            NameGrid = dV.NameFilegrd_R;
        }
        if (type70or30 == 30) {
            NameGrid = dV.NameFilegrd_B;
        }
        let interpolation2D = new Interpolation2D(East, North, NameGrid);
        error = interpolation2D.DoInterpolation();
        if (!error) {
            shiftValueE = interpolation2D.ShiftValueE;
            shiftValueN = interpolation2D.ShiftValueN;
            East = East - shiftValueE;
            North = North = shiftValueN;
        } else {
            return -1;
        }
        if (type70or30 == 70) {
            let H2D = new Helmert2D(
                dV.tE_St70_OS,
                dV.tN_St70_OS,
                dV.dm_St70_OS,
                dV.Rz_St70_OS
            );
            H2D.DoTransformation(East, North);
        }
    }
}

module.exports = StereoToETRS89;
