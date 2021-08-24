console.log("Started fetcher");
let JUDETID;
let LOCALITATE_UAT;
const judeteSelector = document.querySelector(".judete");
const localitatiSelector = document.querySelector(".localitati");

function GetLocalitati(e, param) {
  console.log(param);
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
      localitatiSelector.selectedIndex = 0;
      return json;
    });
  });
}
function GetPoints(params) {}
judeteSelector.addEventListener("change", function (ev) {
  GetLocalitati(ev, 1000);
});
