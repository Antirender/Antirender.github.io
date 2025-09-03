let checkForm = () => {
    let first = document.getElementById("first").value;
    let second = document.getElementById("second").value;
    let result = document.getElementById("result");
    let text = "Your name is " + first + " " + second;
    result.innerHTML = text;
};