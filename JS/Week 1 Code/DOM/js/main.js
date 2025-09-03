let panel = document.getElementById("panel");

//using = will overwrite what is there already
//panel.innerHTML = "This is a message from Javascript";

//using += will add onto what is already there
//panel.innerHTML +="<br>This is a message from Javascript";

//we can add html elements into the page
panel.innerHTML += "<br><img src='img/js.png'>";

//panel.insertAdjacentText('afterBegin', 'Some text to go first');
//panel.insertAdjacentHTML('afterBegin', '<p>Some text to go first</p>');
