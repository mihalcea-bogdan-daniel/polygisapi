const dV = require("./DefaultValues.js");
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
        let shiftValueE, shiftValueN;
        let NameGrid = "";
        let error = 0;
        if (type70or30 == 70) {
            NameGrid = dV.NameFilegrd_R;
        }
        if (type70or30 == 30) {
            NameGrid = dV.NameFilegrd_B;
        }
    }

    DoCompTrans(East, North, hMN, type70or30) {
        let error = 0;
    }
}

module.exports = StereoToETRS89;
