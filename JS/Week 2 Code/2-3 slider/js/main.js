let pic = document.getElementById("target");
let size = document.getElementById("size");

let updateSlider = (slideAmount) => {
    size.innerHTML = slideAmount + "%";
    pic.style.width = slideAmount + "%";
    pic.style.height = slideAmount + "%";
};
