var page = "project";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var projectName = urlParams.get("project")

var slideIndex = 0;

var showDivINterval = setInterval(() => {
    showDivs(++slideIndex);
}, 5000);

function plusDivs(n) {
    clearInterval(showDivINterval);
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}



function showDivs(n) {
    //console.log(n);
    var i;
    var x = document.getElementsByClassName("project-slide");
    if (x.length == 0) {
        return;
    }
    if (n >= x.length) {slideIndex = 0}    
    if (n < 0) {slideIndex = x.length-1}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    x[slideIndex].style.display = "flex";  
}

var projTitle = document.getElementById("proj-title");
var projGeneral = document.getElementById("proj-general");
var projTechnologies = document.getElementById("proj-technologies");
var otherText = document.getElementById("other-text");
var projOther = document.getElementById("proj-other");
var projTags = document.getElementById("proj-tags");
var projVisuals = document.getElementById("proj-visuals");

function getData() {


    if (window.self !== window.top) {
        window.addEventListener("message", (event) => {
            setFields(event.data);
        });
    } else {
        fetchData().then(() => {
            setFields(data[projectName][lang]);
        });
    }
}


function setFields(data) {
    projTitle.innerHTML = data["title"];
    projGeneral.innerHTML = data["general"];
    projTechnologies.innerHTML = data["technologies"];
    if (data["other"] == "") {
        otherText.style.display = "none";
    } else {
        otherText.style.display = "block";
    }
    projOther.innerHTML = data["other"];

    var tags = data["tags"].split(";");
    var visuals = data["visuals"].split(";");
    var captions = data["captions"].split(";");

    projTags.innerHTML = "";
    projVisuals.innerHTML = "";

    for (let i = 0; i < tags.length; i++) {
        const tag = document.createElement("span");
        tag.className = "tag w3-teal w3-tag w3-padding w3-round w3-center";
        tag.textContent = tags[i];
        projTags.appendChild(tag);
    }

    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector("iframe"); // Get the iframe inside the div
                if (iframe && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.01 });


    for (let i = 0; i < visuals.length; i++) {
        if (visuals[i].endsWith("png")) {
            const visual = document.createElement("div");
            visual.className = "project-slide"
            if (captions[i] == "") {
                visual.innerHTML = '<img class="" src="' + visuals[i] + '" width="80%">'
            } else {
                visual.innerHTML = '<img class="" src="' + visuals[i] + '" width="80%"><h3 class="captions">' + captions[i] + '</h3>'
            }
            projVisuals.appendChild(visual);
        } else if (visuals[i].endsWith("mp4")) {
            const visual = document.createElement("div");
            visual.className = "project-slide"
            if (captions[i] == "") {
                visual.innerHTML = '<video width="80%" autoplay controls loop muted><source src="' + visuals[i] + '"></video>' //TODO: pause when hidden
            } else {
                visual.innerHTML = '<video width="80%" autoplay controls loop muted><source src="' + visuals[i] + '"></video><h3 class="captions">' + captions[i] + '</h3>'
            }
            projVisuals.appendChild(visual);
        } else {
            const visual = document.createElement("div");
            visual.className = "project-slide"
            visual.innerHTML = '<iframe class="external-website" data-src="' + visuals[i] + 'lang=' + lang + '" loading="lazy">'
            projVisuals.appendChild(visual);
            observer.observe(visual);
        }
    }

    showDivs(slideIndex);
}





