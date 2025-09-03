let wheel = document.getElementById("wheel");
let container = document.getElementById("container");
let angle = 7;

container.addEventListener("click", (event) => {
    event.preventDefault();

    let dir = Math.floor((Math.random() * 24) + 1) * 15;
    dir = dir + 180;
    angle += dir;

    wheel.style.transform = 'rotate(' + angle + 'deg)';
}, false);
