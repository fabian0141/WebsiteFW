
var page = "main";
var slideIndex = 0;
/*setInterval(() => {
    showDivs();
}, 5000);*/
setInterval(() => {
    showDivs();
}, 5000);

function showDivs() {
    var i;
    var x = document.getElementsByClassName("top-slides");
    if (x.length == 0) {
        return;
    }

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

const titleProjects = document.getElementById('title-projects');
const mainProjects = document.getElementById('main-projects');
const moreProjects = document.getElementById('more--projects');

function getData() {
    fetchData().then(() => {
        mainProjects.innerHTML = "";

        var order = data["order"];
        for (let i = 0; i < order.length; i++) {
            var project = data[order[i]][lang];
            if (i < 3) {
                addTitle(project, order[i]);
            }

            if (i < 6) {
                addProject(true, project, order[i]);
            } else {
                addProject(false, project, order[i]);
            }
        }
        showDivs();
    });
}

function addTitle(projectData, name) {
    var tags = projectData["tags"].split(";");

    const project = document.createElement("div");
    project.className = "top-slides"
    project.innerHTML = `
        <div class="top-slides-img">
            <img src="` + projectData["visuals"].split(";")[0] + `">
        </div>
        <div class="top-slides-info w3-container w3-center">
            <h2><b>` + projectData["title"] + `</b></h2>
            <div class="card-tags">
                ` + addTags(tags) + `
            </div>
            <div style="position: relative;">
                <h3 class="short-general">` + projectData["general"] + `</h3>
                <div class="short-overlay"></div>
            </div>
            <a href="/project?project=` + name + `"><button class="w3-button card-info w3-round more-info-text">Mehr Info</button>
            <br><br>
        </div>
    `        
    titleProjects.appendChild(project);
}

function addProject(isMain, projectData, name) {
    console.log(isMain, projectData)
    var tags = projectData["tags"].split(";");

    const project = document.createElement("div");
    project.className = "card-bg"
    project.innerHTML = `
        <div class="card-top">
            <img src="` + projectData["visuals"].split(";")[0] + `" class="card-img w3-round">
        </div>
        <div class="w3-container w3-center card-bottom">
            <p class="card-title"><b>` + projectData["title"] + `</b></p>
            <div class="card-tags">
                ` + addTags(tags) + `
            </div>
            <a href="/project?project=` + name + `"><button class="w3-button card-info w3-round more-info-text">Mehr Info</button>
        </div>
    `        
    if (isMain) {
        mainProjects.appendChild(project);
    } else {
        moreProjects.appendChild(project);
    }
}

function addTags(tags) {
    var tagsHTML = "";

    for (let i = 0; i < tags.length; i++) {
        tagsHTML += '<span class="tag w3-teal w3-tag w3-padding w3-round w3-center">' + tags[i] + '</span>'
    }
    return tagsHTML;
}