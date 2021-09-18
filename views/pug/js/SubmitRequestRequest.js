let submitForm = document.querySelector(".submit-form");
let submitButton = document.querySelector(".submit-button");



submitForm.onsubmit = function (e) {
    e.preventDefault();
    let coordinatesElement = document.querySelector("#coordinates-textarea");
    let coordString = coordinatesElement.value;
    let typeSelection = document.querySelector(".type-select")
    // let request_url = `https://api.polygis.xyz/transforms/stereo_to_etrs89/`;
    let request_url = `http://localhost:5000/transforms/stereo_to_etrs89/`;
    req_body = {
        "coordinates": coordString,
        "type": typeSelection.value
    }
    fetch(request_url,
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req_body),

        }).then((resp) => {
            console.log(resp.status);
            return resp.json();
        }).then((json) => {
            console.log(json)
        });

}