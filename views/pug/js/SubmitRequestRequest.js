let submitForm = document.querySelector(".submit-form");
let submitButton = document.querySelector(".submit-button");

submitForm.onsubmit = function (e) {
    e.preventDefault();
    let coordinatesElement = document.querySelector("#coordinates-textarea");
    let coordString = coordinatesElement.value;
    let typeSelection = document.querySelector(".type-select");
    let request_url = window.location.href;
    //let request_url = `http://localhost:5000/transforms/stereo_to_etrs89/`;
    console.log(window.location.href);
    req_body = {
        coordinates: coordString,
        type: typeSelection.value,
    };
    fetch(request_url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req_body),
    })
        .then((resp) => {
            return resp.json();
        })
        .then((json) => {
            let responseElement = document.querySelector(".response");
            responseElement.textContent = JSON.stringify(json);
            console.log(responseElement);
            hljs.highlightAll();
        });
};
