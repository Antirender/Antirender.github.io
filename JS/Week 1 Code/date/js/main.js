let today = new Date();

//console.log(today);
//document.write('<h3>' + today + '</h3>');

let hourNow = today.getHours();

//document.write('<h3>' + hourNow + '</h3>');

let greeting;

if (hourNow >= 18) {
greeting = "Good Evening";
} else if (hourNow >= 12) {
greeting = "Good Afternoon";
} else if (hourNow >= 5) {
greeting = "Good Morning";
} else {
greeting = "Welcome";
}
document.write('<h3>' + greeting + '</h3>');
