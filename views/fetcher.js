console.log("Started fetcher");
let JUDETID;
let DENUMIRE_JUDET;
let LOCALITATE_UAT;
let DENUMIRE_LOCALITATE;
let NUMAR_CADASTRAL;
let ARRAY_OF_POINTS;

const container = document.querySelector(".container");
const judeteSelector = document.querySelector(".judete");
const localitatiSelector = document.querySelector(".localitati");
const numarCadastralInput = document.querySelector(".nc-input");
const cautareButton = document.querySelector(".cautare");

function GetLocalitati(e) {
    JUDETID = e.target.value;
    fetch(
        `https://geoportal.ancpi.ro/geoprocessing/rest/services/LOOKUP/UATLookup/GPServer/FastSelect/execute?f=json&Expression=WORKSPACEID = ${JUDETID}`
    ).then((res) => {
        if (!res.ok) {
            alert(`A aparut o eroare`);
        }
        return res.json().then((json) => {
            localitatiSelector.innerHTML = "";
            listalocalitati = json["results"][0]["value"]["features"];
            listalocalitati.forEach((element) => {
                let localitate = element["attributes"];
                let optionElement = document.createElement("option");
                LOCALITATE_UAT = localitate["ADMINISTRATIVEUNITID"];
                optionElement.value = localitate["ADMINISTRATIVEUNITID"];
                optionElement.text = localitate["UAT"];
                localitatiSelector.appendChild(optionElement);
            });
            localitatiSelector.disabled = false;
            numarCadastralInput.disabled = false;
            localitatiSelector.selectedIndex = 0;
            return json;
        });
    });
}

async function Get_DXFFile(
    _judet_id,
    _localitate_uat,
    _numar_cadastral,
    _denumire_localitate,
    _denumire_judet
) {
    let request_url = `https://api.polygis.xyz/dxf/`;
    //let request_url = `http://localhost:5000/dxf/`;
    let req_body = {
        judet_id: _judet_id,
        localitate_uat: _localitate_uat,
        numar_cadastral: _numar_cadastral,
        denumire_localitate: _denumire_localitate,
        denumire_judet: _denumire_judet,
    };
    const response = await fetch(request_url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req_body),
    });
    return response;
}

// Events
numarCadastralInput.addEventListener("input", (e) => {
    if (e.target.value == "") {
        cautareButton.disabled = true;
    } else {
        cautareButton.disabled = false;
    }
    NUMAR_CADASTRAL = e.target.value;
});
localitatiSelector.addEventListener("change", (e) => {
    DENUMIRE_LOCALITATE = e.target.options[e.target.selectedIndex].text;
    LOCALITATE_UAT = e.target.value;
});
judeteSelector.addEventListener("change", function (e) {
    DENUMIRE_JUDET = e.target.options[e.target.selectedIndex].text;
    GetLocalitati(e);
});

{
    /* <span
class="spinner-border spinner-border-sm"
role="status"
aria-hidden="true"
></span>
<span class="sr-only">Loading...</span> */
}

cautareButton.addEventListener("mouseup", function () {
    let loadingElement = document.createElement("span");
    loadingElement.className = "spinner-border text-light spinner-border-sm";
    loadingElement.setAttribute("role", "status");
    loadingElement.setAttribute("aria-hidden", "true");
    let loadingElementText = cautareButton.querySelector(".button-text");
    //loadingElementText.className = "sr-only";
    loadingElementText.textContent = "  Loading ...";
    cautareButton.appendChild(loadingElement);
    cautareButton.appendChild(loadingElementText);
    Get_DXFFile(
        JUDETID,
        LOCALITATE_UAT,
        NUMAR_CADASTRAL,
        DENUMIRE_LOCALITATE,
        DENUMIRE_JUDET
    )
        //TO-DO create eror on not found
        .then((resp) => {
            if (resp.status == 200) {
                cautareButton.removeChild(loadingElement);
                return resp.blob().then((blob) => {
                    const url = URL.createObjectURL(blob);
                    //download(url, "users.dxf");
                    console.log(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${DENUMIRE_JUDET}-${DENUMIRE_LOCALITATE}-${NUMAR_CADASTRAL}.dxf`;
                    a.click();
                    URL.revokeObjectURL(url);
                    loadingElementText.textContent = "Cauta";
                    cautareButton.removeChild(loadingElement);
                });
            } else {
                return resp.text().then(()=>{
                    cautareButton.removeChild(loadingElement);
                    loadingElementText.textContent = "Cauta";
                    let errorMessageElement = document.createElement("div");
                    let closeButton = document.createElement("button");
                    closeButton.className = "btn-close";
                    closeButton.setAttribute("data-bs-dismiss", "alert");
                    closeButton.setAttribute("type", "button");
                    errorMessageElement.className = "row alert alert-warning alert-dismissible fade show mt-3";
                    errorMessageElement.setAttribute("role", "alert");
                    errorMessageElement.textContent = `A aparut o eroare, te rog incarca din nou. Verifica daca datele sunt introduse corect.`
                    errorMessageElement.appendChild(closeButton);
                    container.appendChild(errorMessageElement);
                });
            }
        })

});
