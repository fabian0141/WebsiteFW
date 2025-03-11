var data;
var date;

async function fetchData() {
    date = localStorage.getItem('date');
    if (date === null || date == "undefined") {
        var response = await fetch(window.location.origin + "/data?date=" + date + "&lang=" + lang);
        if (response.ok) {
            var json = await response.json();
            data = json;
            date = data["date"];
            localStorage.setItem("date", data["date"]);
            localStorage.setItem("data", JSON.stringify(json));
        } else {
            data = localStorage.getItem("data", "");
        }
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
                localStorage.setItem("date", json["date"]);
                data["date"] = json["date"];
                localStorage.setItem("data", JSON.stringify(data));
            });
            alert("Saved changes");
        }
    });
}