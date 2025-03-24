
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
const moreProjects = document.getElementById('more-projects');

function getData() {
    fetchData().then(() => {
        titleProjects.innerHTML = "";
        mainProjects.innerHTML = "";
        moreProjects.innerHTML = "";

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
    if (projectData === undefined) {
        return;
    }

    var tags =  projectData["tags"].split(";");
    const project = document.createElement("div");

    project.className = "top-slides"
    let url = projectData["visuals"].split(";")[0];
    let html = '<div class="top-slides-img">';
    if (url.endsWith("png")) {
        html += '<img src="' + url + '">';
    } else if (url.endsWith("mp4")) {
        html += '<video autoplay loop muted><source src="' + url + '"></video>';
    }

            

    project.innerHTML = html + `</div>
        <div class="top-slides-info w3-container w3-center">
            <h2><b>` + projectData["title"] + `</b></h2>
            <div class="top-card-tags">
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
    if (projectData === undefined) {
        return;
    }

    var tags = projectData["tags"].split(";");

    const project = document.createElement("div");
    project.className = "card-bg"
    let html = '<div class="card-top">';

    let url = projectData["visuals"].split(";")[0];
    if (url.endsWith("png")) {
        html += '<img src="' + url + '" class="card-img w3-round">';
    } else if (url.endsWith("mp4")) {
        html += '<video autoplay loop muted class="card-vid w3-round"><source src="' + url + '"></video>';
    }

    project.innerHTML = html + `</div>
        <div class="w3-container w3-center card-bottom">
            <p class="card-title"><b>` + projectData["title"] + `</b></p>
            <a href="/project?project=` + name + `"><button class="w3-button card-info w3-round more-info-text">Mehr Info</button>

            <div class="card-tags">
                ` + addTags(tags) + `
            </div>
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