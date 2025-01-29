
var page = "main";
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
    x[slideIndex].style.display = "flex";  
    slideIndex = (slideIndex + 1) % x.length;
}

function showMoreProjects(showMore) {
    var moreProjects = document.getElementById("more-projects");
    var moreProjectsButton = document.getElementById("more-projects-button");
    var lessProjectsButton = document.getElementById("less-projects-button");

    moreProjects.style.display = showMore ? "Block" : "None";
    moreProjectsButton.style.display = showMore ? "None" : "Block";
    lessProjectsButton.style.display = showMore ? "Block" : "None";
}