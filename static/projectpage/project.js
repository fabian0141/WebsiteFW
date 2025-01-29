var page = "project";

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("project-slide");
    var dots = document.getElementsByClassName("demo");
    if (n > x.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" carousel-select", "");
    }
    x[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " carousel-select";
}

getData();

function getData() {
    fetch(window.location.origin + "/project-data?project=ffw&lang=ENG").then((response) => response.json()).then((data) => {
        console.log(data);
        var projName = document.getElementById("proj-name");
        projName.textContent = data["general"];
    });
}



