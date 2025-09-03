let panel=document.getElementById("panel")
panel.innerHTML = "This is message from html";
panel.innerHTML += "<br><img src='../img/js.png'>";
panel.insertAdjacentText('afterbegin','some text')
let today = new Date();
console.log(today);
document.write('<h2>'+ today +'<h2>');

let hourNow = today.getHours();

let greeting;
if(hourNow >=18){
    greeting = '../img/js.png';
} else if (hourNow >=7){
    greeting = '../img/happy.png';
}
else {
    greeting = '../img/js.png';
}
document.write('<img src=" ' + greeting +  ' " alt="Greeting Image">');
// document.write('<h2>'+ greeting +'<h2>');



let snow = true;

if (!snow) {

console.log("skating")

} else {

console.log("skiing")

}

