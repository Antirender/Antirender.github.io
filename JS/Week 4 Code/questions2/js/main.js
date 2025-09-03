let answers = ["Yes", "OK then", "Go For it", "No way", "Don't do it", "Never"];
    
let checkForm = () => {
    let inputField = document.getElementById("q");
    let quest = inputField.value.trim();
    let response = document.getElementById("response");

    if (!quest) {
        inputField.classList.add('error');
        setTimeout(() => inputField.classList.remove('error'), 500);
        return;
    }

    response.classList.remove('s');
    

    void response.offsetHeight;
    
    let n = Math.floor(Math.random() * answers.length);
    response.textContent = answers[n];
    

    response.classList.add('s');
}


document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        checkForm();
    }
});

document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "e") {
        e.preventDefault();
        checkForm();
    }
});