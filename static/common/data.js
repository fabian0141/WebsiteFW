var data;
var date;

async function fetchData() {
    date = localStorage.getItem('date');
    var response = await fetch(window.location.origin + "/data?date=" + date + "&lang=" + lang);
    if (response.ok) {
        var json = await response.json();
        data = json[1];
        date = json[0];
        localStorage.setItem("date", date);
        localStorage.setItem("data", JSON.stringify(json[1]));
    } else {
        date = localStorage.getItem("date", 0);
        data = JSON.parse(localStorage.getItem("data"));
    }
}

function saveData() {
    fetch(window.location.origin + "/data?&password=" + password.value, { method: "POST", body: JSON.stringify(data)}).then((response) => {
        if (!response.ok) {
            alert("Could not save");
        } else {
            response.json().then((json) => {
                date = json;
                localStorage.setItem("date", json);
                localStorage.setItem("data", JSON.stringify(data));
            });
            alert("Saved changes");
        }
    });
}