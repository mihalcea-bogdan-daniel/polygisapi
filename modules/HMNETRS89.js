const { Interpolation1D } = require("./Interpoliation1D");
const dV = require("./DefaultValues.js");
function HMNETRS89(phi, la, hMN) {
    let h;
    let interpolation1D = Interpolation1D(phi, la, dV.NameFilegrdz);
    let error = interpolation1D.DoInterpolation();
    if (error == 0) {
        h = hMN + interpolation1D.ShiftValue;
        return h;
    } else {
        throw new Error("HMNETRS89 Error!");
    }
}

module.exports = HMNETRS89;
