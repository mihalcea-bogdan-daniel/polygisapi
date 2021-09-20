const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "polyGIS",
            version: "0.1.0",
            description:
                "This is a simple REST API which makes GIS transformations.",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "polyGIS",
                url: "https://api.polygis.xyz",
                email: "contact@polygis.xyz",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/transforms",
            },
        ],
    },
    apis: ["./routes/transforms/etrs89_to_stereo.js"],
};

module.exports = options;
