var slideIndex = 0;
showDivs();
/*setInterval(() => {
    showDivs();
}, 5000);*/

function showDivs() {
    var i;
    var x = document.getElementsByClassName("top-slides");

    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    console.log(slideIndex, x[slideIndex]);
    x[slideIndex].style.display = "block";  
    slideIndex = (slideIndex + 1) % x.length;
}