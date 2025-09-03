//               0      1         2            3     
let answers = ["Yes", "OK then", "Go For it", "No way", "Don't do it", "Never"];

let checkForm = () => {
    let quest = document.getElementById("q").value;
    let response = document.getElementById("response");

    let n = Math.floor(Math.random() * 6);
    response.innerHTML = answers[n];
}
