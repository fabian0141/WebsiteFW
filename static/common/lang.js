var lang = "ENG";
getLang();

function getLang() {
    var lang = localStorage.getItem('language');
    if (lang === null || lang == "undefined") {
        var browserLang = navigator.language;
        if (browserLang.startsWith("de")) {
            lang = "DEU";
        } else {
            lang = "ENG";
        }
    }

    var id;
    if (lang == "DEU") {
        id = "lang-eng";
    } else if (lang == "ENG") {
        id = "lang-deu";
    }
    changeLang(id, lang);
}

function changeLang(id, newLang) {
    if (newLang === null) {
        return
    }
    lang = newLang;

    localStorage.setItem('language', lang);

    var x = document.getElementsByClassName("lang-img");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x = document.getElementById(id);
    x.style.display = "block";

    if (page == "main") {
        setMainLang();
    } else if (page == "project") {
        setProjectLang();
    }
}

function setMainLang() {
    switch(lang) {
        case "DEU":
            var x = document.getElementsByClassName("more-info-text");
            for (i = 0; i < x.length; i++) {
                x[i].textContent = " Mehr Info ";
            }

            document.getElementById("project-title-text").textContent = "Professionelle / Persönliche Projekte";
            document.getElementById("more-projects-button").textContent = "Zeige mehr";
            document.getElementById("less-projects-button").textContent = "Zeige weniger";

            document.getElementById("skill-lang-text").textContent = "Sprachen";
            document.getElementById("skill-german-text").textContent = "Deutsch";
            document.getElementById("skill-english-text").textContent = "Englisch";
            document.getElementById("skill-spanish-text").textContent = "Spanisch";
            document.getElementById("skill-proglanguage-text").textContent = "Programmiersprachen";
            document.getElementById("skill-softwarearea-text").textContent = "Softwaregebiet";
            document.getElementById("skill-webdevelopment-text").textContent = "Webentwicklung";
            document.getElementById("skill-3d-text").textContent = "3D Entwicklung";

            document.getElementById("interests-title").textContent = "Interessen / Freizeit";
            document.getElementById("int-swimmming").textContent = "Schwimmen";
            document.getElementById("int-biking").textContent = "Fahrrad fahren";
            document.getElementById("int-dancing").textContent = "Tanzen";
            document.getElementById("int-programmming").textContent = "Programmieren";
            document.getElementById("int-repairing").textContent = "Geräte reparieren";
            document.getElementById("int-shortpants").textContent = "Kurze Hosen(im Winter)";
            document.getElementById("int-helpfirefighters").textContent = "Unterstützung bei Freiwilliger Feuerwehr";
            document.getElementById("int-boardgames").textContent = "Brettspiele";
            document.getElementById("int-computergames").textContent = "Computerspiele";
            document.getElementById("int-cooking").textContent = "Kochen";

            document.getElementById("aboutme-title").textContent = "Über Mich";
            document.getElementById("aboutme-text").innerHTML = `
            Ich habe erfolgreich meinen Bachelor in Informatik am KIT in Karlsruhe beendet und bin nun auf der Suche nach einem Software Entwickler Beruf. Besonders interessieren mich Berufe im Bereich High-Performance Computing.
            <br><br>
            Ich bin eine vielseitige und hilfsbereite Person, die ihre Zeit gerne nutzt, um andere zu unterstützen und Neues zu entdecken. Ob beim Programmieren, dem Reparieren von Geräten oder bei meiner Tätigkeit in der Freiwilligen Feuerwehr – ich genieße es, praktische Lösungen zu finden und einen Beitrag zu leisten.
            <br><br>
            Sport spielt ebenfalls eine wichtige Rolle in meinem Leben: Ich schwimme, fahre Fahrrad, spiele Basketball und Volleyball, tanze leidenschaftlich gern und scheue auch im Winter nicht davor zurück, kurze Hosen zu tragen.
            <br><br>
            Meine Interessen in Computergrafik, Simulationen und künstlicher Intelligenz verbinden Technik mit Kreativität. Diese Leidenschaft zeigt sich auch, wenn ich Kostüme bastle oder Designs in GIMP erstelle – hier vereinen sich meine technischen Fähigkeiten und meine Freude am kreativen Gestalten. Das passt perfekt zu meiner Begeisterung fürs Programmieren, wo ich mich in ähnlicher Weise ausleben kann.
            <br><br>
            In meiner Freizeit finde ich außerdem Spaß an Brettspielen, Computerspielen und Kochen. Ich bin jemand, der gerne aktiv ist und immer nach neuen Herausforderungen sucht – sei es im Alltag oder in meiner Freizeit.`;

        
            document.getElementById("lang-text").textContent = "Sprache: ";
            document.getElementById("contacts-text").textContent = "Kontaktiere mich: ";
            break;
        case "ENG":
            var x = document.getElementsByClassName("more-info-text");
            for (i = 0; i < x.length; i++) {
                x[i].textContent = " More Info ";
            }

            document.getElementById("project-title-text").textContent = "Professional / Personal Projects";
            document.getElementById("more-projects-button").textContent = "Show more";
            document.getElementById("less-projects-button").textContent = "Show less";

            document.getElementById("skill-lang-text").textContent = "Languages";
            document.getElementById("skill-german-text").textContent = "German";
            document.getElementById("skill-english-text").textContent = "English";
            document.getElementById("skill-spanish-text").textContent = "Spanish";
            document.getElementById("skill-proglanguage-text").textContent = "Programming languages";
            document.getElementById("skill-softwarearea-text").textContent = "Softwarearea";
            document.getElementById("skill-webdevelopment-text").textContent = "Webdevelopment";
            document.getElementById("skill-3d-text").textContent = "3D Development";

            document.getElementById("aboutme-title").textContent = "About me";
            document.getElementById("aboutme-text").innerHTML = `
            I successfully completed my Bachelor's degree in Computer Science at KIT in Karlsruhe and am now looking for a job as a software developer. I am particularly interested in positions in the field of High-Performance Computing.
            <br><br>
            I am a versatile and helpful person who enjoys using my time to support others and learn new things. Whether it's programming, repairing devices, or assisting in the volunteer fire department – I love finding practical solutions and making a contribution.
            <br><br>
            Sports also play an important role in my life: I swim, cycle, play basketball and volleyball, have a passion for dancing, and don’t shy away from wearing shorts even in winter.
            <br><br>
            My interests in computer graphics, simulations, and artificial intelligence combine technology with creativity. This passion is also reflected in my hobby of crafting costumes or designing in GIMP – where my technical skills and love for creative design come together. This aligns perfectly with my enthusiasm for programming, which allows me to express myself in a similar way.
            <br><br>
            In my free time, I also enjoy board games, video games, and cooking. I am someone who loves being active and always seeks new challenges – whether in software development or my personal life.`;

            document.getElementById("interests-title").textContent = "Interests / Freetime";
            document.getElementById("int-swimmming").textContent = "Swimming";
            document.getElementById("int-biking").textContent = "Biking";
            document.getElementById("int-dancing").textContent = "Dancing";
            document.getElementById("int-programmming").textContent = "Programmming";
            document.getElementById("int-repairing").textContent = "Repairing electronics";
            document.getElementById("int-shortpants").textContent = "Short pants(during winter)";
            document.getElementById("int-helpfirefighters").textContent = "Helping at voluntary fire brigade";
            document.getElementById("int-boardgames").textContent = "Board games";
            document.getElementById("int-computergames").textContent = "Computer games";
            document.getElementById("int-cooking").textContent = "Cooking";
        
            document.getElementById("lang-text").textContent = "Language: ";
            document.getElementById("contacts-text").textContent = "Contact me: ";
            break;
    }
    getData();
}

function setProjectLang() {

    switch(lang) {
        case "DEU":
            document.getElementById("return-text").textContent = "❮ Zurück";
            document.getElementById("prev-button").textContent = "❮ Voriges";
            document.getElementById("next-button").textContent = "Nächstes ❯";
            document.getElementById("general-text").textContent = "Generell:";
            document.getElementById("technologies-text").textContent = "Technologien:";
            document.getElementById("other-text").textContent = "Sonstiges:";

            document.getElementById("lang-text").textContent = "Sprache: ";
            document.getElementById("contacts-text").textContent = "Kontaktiere mich: ";
            break;
        case "ENG":
            document.getElementById("return-text").textContent = "❮ Back";
            document.getElementById("prev-button").textContent = "❮ Prev";
            document.getElementById("next-button").textContent = "Next ❯";
            document.getElementById("general-text").textContent = "General:";
            document.getElementById("technologies-text").textContent = "Technologies:";
            document.getElementById("other-text").textContent = "Other:";

            document.getElementById("lang-text").textContent = "Language: ";
            document.getElementById("contacts-text").textContent = "Contact me: ";
            break;
    }
    getData();
}