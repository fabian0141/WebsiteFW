const password = document.getElementById('password');
const projectID = document.getElementById('projID');
const projectPrio = document.getElementById('projPriority');
const title = document.getElementById('title');
const generalInfo = document.getElementById('general-info');
const technologies = document.getElementById('technologies');
const otherInfo = document.getElementById('other-info');
const tags = document.getElementById('tags');
const visuals = document.getElementById('visuals');
const captions = document.getElementById('captions');
const projectSelect = document.getElementById('projects');
const projectLang = document.getElementById('language');

let changed = false;

const preview = document.getElementById('preview');
var projectData = {};
var lang = "DEU";

function updatePreviewData() {
    projectData["title"] = title.value;
    projectData["general"] = generalInfo.value;
    projectData["technologies"] = technologies.value;
    projectData["other"] = otherInfo.value;
    projectData["tags"] = tags.value;
    projectData["visuals"] = visuals.value;
    projectData["captions"] = captions.value;
    changed = true;
}

const resizer = document.getElementById("resizer");
let isResizing = false;

resizer.addEventListener("mousedown", (e) => {
    preview.style.pointerEvents = "none";
    isResizing = true;
});
  
document.addEventListener("mousemove", (e) => {
    if (isResizing) {
        let newWidth = preview.getBoundingClientRect().right - e.clientX;
        preview.style.width = `${newWidth}px`;
    }
});

document.addEventListener("mouseup", (e) => {
    isResizing = false;
    preview.style.pointerEvents = "all";
});

updatePreviewPeriodically();

function updatePreviewPeriodically() {
    if (changed) {
        preview.contentWindow.postMessage(projectData, "*");
    }
    changed = false;
    setTimeout(updatePreviewPeriodically, 100);
}

fetchData().then(() => {
    //console.log(data);
    showOptions();
});

function showOptions() {
    var order = data["order"];
    projectSelect.innerHTML = '<option value="new">New</option>';

    for (let i = 0; i < order.length; i++) {
        const option = document.createElement("option");
        option.value = order[i];
        option.textContent = order[i] + " - " + data[order[i]].prio;
        projectSelect.appendChild(option);
    }
}

function deleteProject() {
    var projID = projectID.value;
    delete data[projID];
    var order = data["order"];

    for (let i = 0; i < order.length; i++) {
        if (projID == order[i]) {
            data["order"].splice(i, 1);
            break;
        }
    }

    saveData();
    showOptions();
}

function saveProject() {
    var projID = projectID.value;
    if (projID != "") {
        if (data[projID] == null) {
            data[projID] = {"prio": Number(projectPrio.value)};
            insertOrder(projID);
        }
        data[projID][lang] = projectData;
    }

    saveData();
    showOptions();
}

function insertOrder(projID) {
    var order = data["order"];
    var prio = Number(projectPrio.value);

    for (let i = 0; i < order.length; i++) {
        if (prio < data[order[i]].prio) {
            data["order"].splice(i, 0, projID);
            return;
        }
    }
    data["order"].push(projID);
}


function selectProject() {
    var projID = document.getElementById("projects").value;
    lang = document.getElementById("language").value;

    if (projID == "new") {
        projectData = {};
        return;
    }
    var newData = data[projID][lang];
    if (newData != null) {
        projectData = structuredClone(newData)
        //console.log(projID, lang, projectData);

        projectID.value = projID;
        projectPrio.value =  data[projID].prio;
        title.value = projectData.title;
        generalInfo.value = projectData.general;
        technologies.value = projectData.technologies;
        otherInfo.value = projectData.other;
        tags.value = projectData.tags;
        visuals.value = projectData.visuals;
        captions.value = projectData.captions;
        changed = true;
    } else {
        projectID.value = projID;
        projectPrio.value =  data[projID].prio;
        projectData = {};
    } 
}