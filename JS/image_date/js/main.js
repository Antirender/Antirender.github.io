let today = new Date();

//console.log(today);
//document.write('<h3>' + today + '</h3>');

let hourNow = today.getHours();

//document.write('<h3>' + hourNow + '</h3>');

let greeting;

if (hourNow >= 18) {
    greeting = '../img/evening.jpg';
} else if (hourNow >= 12) {
    greeting = '../img/afternoon.jpg';
} else if (hourNow < 12) {
    greeting = '../img/morning.jpg';
}
document.write('<img src = " ' + greeting + ' ">');
