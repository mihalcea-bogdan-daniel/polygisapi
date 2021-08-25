console.log("Started fetcher");
let JUDETID;
let LOCALITATE_UAT;
let NUMAR_CADASTRAL;
let ARRAY_OF_POINTS;

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

async function GetPoints(e) {
  //https://geoportal.ancpi.ro/maps/rest/services/eterra3_publish/MapServer/1/query?f=json&where=INSPIRE_ID%20%3D%20%27RO.234.100969.63435%27&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=NATIONAL_CADASTRAL_REFERENCE

  alert(document.referer);
  let request_url = `https://geoportal.ancpi.ro/maps/rest/services/eterra3_publish/MapServer/1/query?f=json&where=INSPIRE_ID='RO.${JUDETID}.${LOCALITATE_UAT}.${NUMAR_CADASTRAL}'&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=NATIONAL_CADASTRAL_REFERENCE`;
  const response = await fetch(request_url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      Host: "geoportal.ancpi.ro",
      Referer: "https://geoportal.ancpi.ro/geoportal/imobile/Harta.html",
      Origin: "http://geoportal.ancpi.ro",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  console.log(response.status);
  return response.json();
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
  LOCALITATE_UAT = e.target.value;
});
judeteSelector.addEventListener("change", function (e) {
  GetLocalitati(e);
});

cautareButton.addEventListener("mouseup", function (e) {
  GetPoints(e).then((data) => {
    console.log(data);
  });
});
