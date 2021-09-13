class StereoNEFiLa {
    constructor(ca, cnf) {
        this.a = ca;
        this.nf = cnf;
        this.Fi;
        this.La;
    }
    DoConversion2(North, East) {
        this.Fi = 0;
        this.La = 0;
        let br1 = (46 * Math.PI) / 180;
        let la0 = (25 * Math.PI) / 180;
        let k0 = 0.99975;

        let f = 1 / this.nf;
        let b = this.a * (1 - f);
        let ep = Math.sqrt((this.a ** 2 - b ** 2) / this.a ** 2);
        let w = Math.sqrt(1 - ep ** 2 * Math.sin(br1) ** 2);
        let raza = (this.a * (1 - ep ** 2)) / w ** 3;
        raza = Math.sqrt((raza * this.a) / w);
        let n = (ep ** 2 * Math.cos(br1) ** 4) / (1 - ep ** 2);
        n = Math.sqrt(1 + n);
        let s1 = (1 + Math.sin(br1)) / (1 - Math.sin(br1));
        let s2 = (1 - ep * Math.sin(br1)) / (1 + ep * Math.sin(br1));
        let w1 = Math.exp(n * Math.log(s1 * Math.exp(ep * Math.log(s2))));
        let c =
            ((n + Math.sin(br1)) * (1 - (w1 - 1) / (w1 + 1))) /
            ((n - Math.sin(br1)) * (1 + (w1 - 1) / (w1 + 1)));
        let w2 = c * w1;

        let hi0 = (w2 - 1) / (w2 + 1);
        hi0 = Math.atan(hi0 / Math.sqrt(1 - hi0 ** 2));
        let g = 2 * raza * k0 * Math.tan(Math.PI / 4 - hi0 / 2);
        let h = 4 * raza * k0 * Math.tan(hi0) + g;
        let fn = 500000;
        let fe = 500000;

        let ii = Math.atan((East - fe) / (h + (North - fn)));
        let j = Math.atan((East - fe) / (g - (North - fn))) - ii;
        let lam = j + 2 * ii + la0;
        this.La = la0 + (lam - la0) / n;
        let hi =
            hi0 +
            2 *
                Math.atan(
                    (North - fn - (East - fe) * Math.tan(j / 2)) /
                        (2 * raza * k0)
                );
        let csi =
            (0.5 * Math.log((1 + Math.sin(hi)) / (c * (1 - Math.sin(hi))))) / n;
        this.Fi = 2 * Math.atan(Math.exp(csi)) - Math.PI / 2;
        let i = 0;
        let tol = 0.000001;
        let dif = 100;
        while (dif > tol && i < 50) {
            i += 1;
            let fic = this.Fi;
            let csii = Math.log(
                Math.tan(this.Fi / 2 + Math.PI / 4) *
                    Math.exp(
                        (ep / 2) *
                            Math.log(
                                (1 - ep * Math.sin(this.Fi)) /
                                    (1 + ep * Math.sin(this.Fi))
                            )
                    )
            );
            this.Fi =
                this.Fi -
                ((csii - csi) *
                    Math.cos(this.Fi) *
                    (1 - ep ** 2 * Math.sin(this.Fi) ** 2)) /
                    (1 - ep ** 2);
            dif = Math.abs(
                (this.Fi * 180 * 60 * 60) / Math.PI -
                    (fic * 180 * 60 * 60) / Math.PI
            );
        }
        return { Fi: this.Fi, La: this.La };
    }
}

class StereoFiLaNE {
    constructor(ca, cnf) {
        this.a = ca;
        this.nf = cnf;
        this.North;
        this.East;
    }
    DoConversion1(Fi, La) {
        let br1 = (46 * Math.PI) / 180;
        let la0 = (25 * Math.PI) / 180;
        let k0 = 0.99975;

        let f = 1 / this.nf;
        let b = this.a * (1 - f);
        let ep = Math.sqrt((this.a ** 2 - b ** 2) / this.a ** 2);
        let w = Math.sqrt(1 - ep ** 2 * Math.sin(br1) ** 2);
        let raza = (this.a * (1 - ep ** 2)) / w ** 3;
        raza = Math.sqrt((raza * this.a) / w);
        let n = (ep ** 2 * Math.cos(br1) ** 4) / (1 - ep ** 2);
        n = Math.sqrt(1 + n);
        let s1 = (1 + Math.sin(br1)) / (1 - Math.sin(br1));
        let s2 = (1 - ep * Math.sin(br1)) / (1 + ep * Math.sin(br1));
        let w1 = Math.exp(n * Math.log(s1 * Math.exp(ep * Math.log(s2))));
        let c =
            ((n + Math.sin(br1)) * (1 - (w1 - 1) / (w1 + 1))) /
            ((n - Math.sin(br1)) * (1 + (w1 - 1) / (w1 + 1)));
        let w2 = c * w1;

        let hi0 = (w2 - 1) / (w2 + 1);
        hi0 = Math.atan(hi0 / Math.sqrt(1 - hi0 * hi0));
        let sa = (1 + Math.sin(Fi)) / (1 - Math.sin(Fi));
        let sb = (1 - ep * Math.sin(Fi)) / (1 + ep * Math.sin(Fi));
        w = c * Math.exp(n * Math.log(sa * Math.exp(ep * Math.log(sb))));
        let hi = (w - 1) / (w + 1);
        hi = Math.atan(hi / Math.sqrt(1 - hi * hi));
        let lam = n * (La - la0) + la0;
        let beta =
            1 +
            Math.sin(hi) * Math.sin(hi0) +
            Math.cos(hi) * Math.cos(hi0) * Math.cos(lam - la0);
        this.East = (2 * raza * k0 * Math.cos(hi) * Math.sin(lam - la0)) / beta;
        this.North =
            (2 *
                raza *
                k0 *
                (Math.cos(hi0) * Math.sin(hi) -
                    Math.sin(hi0) * Math.cos(hi) * Math.cos(lam - la0))) /
            beta;
        this.North = this.North + 500000;
        this.East = this.East + 500000;
    }
}

module.exports = { StereoNEFiLa, StereoFiLaNE };
