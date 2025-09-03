let d = document.getElementById("d");
let r = document.getElementById("result");

let picked = (e) => {
    let date = new Date(e.target.value); 
    console.log(date);

    date.setDate(date.getDate() + 8); 

    let textDate = date.toDateString(); 
    r.innerHTML = "Next week is: " + textDate; 
};
