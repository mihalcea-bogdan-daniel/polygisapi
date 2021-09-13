const dV = require("./DefaultValues.js");
const { Interpolation2D } = require("./Interpoliation1D");
const Helmert2D = require("./Helmert2D.js");
const { StereoNEFiLa, StereoFiLaNE } = require("./StereoNEFila.js");

class StereoToETRS89 {
    #phi;
    #la;
    #h;
    constructor(name) {
        this.name = name;
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
            North = North - shiftValueN;
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
            let Helm2DLatLon = H2D.DoTransformation(East, North);
            this.EastS = Helm2DLatLon.Eastt;
            this.NorthS = Helm2DLatLon.Northt;
        }
        if (type70or30 == 30) {
            let H2D = new Helmert2D(
                dV.tE_St30_OS,
                dV.tN_St30_OS,
                dV.dm_St30_OS,
                dV.Rz_St30_OS
            );
            let Helm2DLatLon = H2D.DoTransformation(East, North);
            this.EastS = Helm2DLatLon.Eastt;
            this.NorthS = Helm2DLatLon.Northt;
        }
        //{Conversion Oblique Stereographic to GRS80}
        let stNEFiLa = new StereoNEFiLa(dV.A_ETRS89, dV.INV_F_ETRS89);
        stNEFiLa.DoConversion2(this.NorthS, this.EastS);
        this.#phi = stNEFiLa.Fi;
        this.#la = stNEFiLa.La;
        this.#phi = (this.#phi * 180) / Math.PI;
        this.#la = (this.#la * 180) / Math.PI;
        return 0;
    }
}

class ETRS89ToStereo {
    constructor(name) {
        this.name = name;
        this.East;
        this.North;
    }
    DoTransformation(phi, la, type70or30) {
        let EastS, NorthS, shiftValueE, shiftValueN;
        let nameGrid;
        let error = 0;
        phi = (phi * Math.PI) / 180;
        la = (la * Math.PI) / 180;
        let stFiLaNE = new StereoFiLaNE(dV.A_ETRS89, dV.INV_F_ETRS89);
        stFiLaNE.DoConversion1(phi, la);
        NorthS = stFiLaNE.North;
        EastS = stFiLaNE.East;
        if (type70or30 == 70) {
            let H2D = new Helmert2D(
                dV.tE_OS_St70,
                dV.tN_OS_St70,
                dV.dm_OS_St70,
                dV.Rz_OS_St70
            );
            let Helm2DLatLon = H2D.DoTransformation(EastS, NorthS);
            this.East = Helm2DLatLon.Eastt;
            this.North = Helm2DLatLon.Northt;
            nameGrid = dV.NameFilegrd_R;
        }
        if (type70or30 == 30) {
            let H2D = new Helmert2D(
                dV.tE_OS_St30,
                dV.tN_OS_St30,
                dV.dm_OS_St30,
                dV.Rz_OS_St30
            );
            let Helm2DLatLon = H2D.DoTransformation(EastS, NorthS);
            this.East = Helm2DLatLon.Eastt;
            this.North = Helm2DLatLon.Northt;
            nameGrid = dV.NameFilegrd_R;
        }
        let interpolation2d = new Interpolation2D(
            this.East,
            this.North,
            nameGrid
        );
        error = interpolation2d.DoInterpolation();
        if (error == 0) {
            shiftValueE = interpolation2d.ShiftValueE;
            shiftValueN = interpolation2d.ShiftValueN;
            this.East = this.East + shiftValueE;
            this.North = this.North + shiftValueN;
        } else {
            return -1;
        }
        return 0;
    }
}

module.exports = { StereoToETRS89, ETRS89ToStereo };
