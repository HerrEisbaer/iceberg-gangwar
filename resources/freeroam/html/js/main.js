//FiveM NUI Stuff

window.addEventListener('message', (e) => {
    switch (e.data.type) {
        case "openFrakmenu":
            openFrakauswahl("dashboard")
            break
        case "closeFrakmenu":
            document.querySelector(".frakauswahl").style.display = 'none';
            break
        case "openCar":
            openCarAuswahl()
            break
        case "closeCar":
            document.querySelector(".carauswahlsec").style.display = 'none';
            break
        case "setKrieg":
            setKrieg(e.data.fraks);
            break;
        case "setBestFrak":
            setBestFrak(e.data.frakdata);
            break;
        case "openFrakcreator":
            openFrakcreator()
            break
        case "closeFrakcreator":
            document.querySelector(".frakcreator-section").style.display = 'none';
            break
        case "testclothing":
            openTestClothing()
            break
        case "closetestclothing":
            document.querySelector(".testclothingsec").style.display = 'none';
            break
    }
})

var userstats
var currentFrak = {}


const sections = document.querySelectorAll('section');

sections.forEach(section => {
    section.style.display = 'none';
})

document.querySelector(".notifysec").style.display = 'block';

// openLogin()
// openFrakauswahl("dashboard")
// openFrakcreator()
// openTestClothing()
// showHUD()
// openCarAuswahl()

async function openFrakauswahl(startpage) {
    const dashboardtem = document.getElementById("dashboardtem");
    const fraktem = document.getElementById("fraktem");
    const clothingtem = document.getElementById("clothingtem");
    const settingstem = document.getElementById("settingstem");
    var currentPage;
    const currentfrakimg = document.getElementById("currentfrakimg");
    const content = document.getElementById("frakauswahlcontent");
    document.querySelector(".frakauswahl").style.display = 'block';
    document.getElementById("dashboard").addEventListener('click', openDashboard);
    document.getElementById("frak").addEventListener('click', openFrak);
    document.getElementById("outfit").addEventListener('click', openClothing);
    document.getElementById("settings").addEventListener('click', openSettings);

    var settings = await fetch('https://ibgw-manager/getUserSettings').then(res => res.json());

    const settingnames = {
        weapons: {
            title: "Waffen",
            description: "Wähle deine Waffen",
            advancedrifle: {
                title: "Advancedrifle",
                description: "⭐⭐⭐⭐"
            },
            bullpuprifle: {
                title: "Bullpuprifle",
                description: "⭐⭐⭐⭐"
            },
            specialcarbine: {
                title: "Spezialkarabiner",
                description: "⭐⭐⭐⭐⭐"
            },
            carbinerifle: {
                title: "Karabiner",
                description: "⭐⭐⭐"
            },
            assaultrifle: {
                title: "AK",
                description: "⭐⭐⭐"
            },
            smg: {
                title: "SMG",
                description: "⭐⭐"
            },
            gusenberg: {
                title: "Gusenberg",
                description: "⭐⭐⭐⭐"
            },
            pistol: {
                title: "Pistole",
                description: "⭐⭐⭐"
            },
            pistol50: {
                title: "Pistole .50",
                description: "⭐⭐⭐"
            },
            heavypistol: {
                title: "Schwere Pistole",
                description: "⭐⭐⭐⭐"
            },
            bat: {
                title: "Baseballschläger",
                description: "⭐⭐⭐⭐"
            },
            battleaxe: {
                title: "Kampfaxt",
                description: "⭐⭐⭐⭐"
            },
            golfclub: {
                title: "Golfschläger",
                description: "⭐⭐⭐⭐"
            }
        },
        friends: {
            title: "Freunde",
            description: "Einstellungen zu deinen Freunden",
            allowfr: {
                title: "Freundschaftsanfragen",
                description: "An/Aus"
            },
        }
    }

    const clothingnames = await fetch('../../clothing.json').then(resp => resp.json());

    currentfrakimg.style.display = 'none';

    const exitelem = document.getElementById("exit");
    exitelem.style.display = "none";

    checkIfAllValid()

    const wehfunction = () => {
        document.querySelector(".frakauswahl").style.display = 'none';
        fetch("https://freeroam/leaveFrakNUI", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                frak: currentFrak
            })
        });
        exitelem.removeEventListener('click', wehfunction);
        return;
    }

    exitelem.addEventListener('click', wehfunction)

    function checkIfAllValid() {
        if (currentFrak.name != null) {
            exitelem.style.display = "block";
            currentfrakimg.querySelector("img").src = `../img/fraktionen/${currentFrak.name.toLowerCase()}.png`;
            currentfrakimg.style.display = 'block';
        }
    }

    function resetContent() {
        content.innerHTML = "";
        currentPage = null;
    }

    async function openDashboard() {
        const color = "rgba(0, 50, 255, 0.8)"
        if (currentPage === "dashboard") return
        resetContent();
        content.appendChild(dashboardtem.content.cloneNode(true));

        content.style.background = "black";

        const userdiscordid = await fetch('https://ibgw-manager/getDiscordId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        }).then(res => res.json());

        const hallologoundsop = await fetch(`http://localhost:42069/discordapi/getuser/${userdiscordid}`).then(res => res.json());

        document.getElementById("useravater").src = hallologoundsop.displayAvatarURL;

        const killsdbel = document.querySelector(".kills");
        const deathsdbel = document.querySelector(".deaths");
        const leveldbel = document.querySelector(".level");

        fetch(`https://${GetParentResourceName()}/getUserStats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        }).then(res => res.json()).then(res => {
            killsdbel.querySelector('h2').innerText = res.kills;
            deathsdbel.querySelector('h2').innerText = res.deaths;
            leveldbel.querySelector('h2').innerText = res.level.level;
        })

        fetch('http://localhost:42069/database/durchschnitte').then(res => res.json()).then(durchschnitte => {
            durchschnitte.forEach(durchschnitt => {
                switch(durchschnitt.type) {
                    case 0:
                        killsdbel.querySelector("p").innerText = `Alle Spieler haben durchschnittlich ${durchschnitt.value} Kills`;
                        break;
                    case 1:
                        deathsdbel.querySelector("p").innerText = `Alle Spieler haben durchschnittlich ${durchschnitt.value} Deaths`;
                        break;
                    case 2:
                        leveldbel.querySelector("p").innerText = `Alle Spieler sind durchschnittlich Level ${durchschnitt.value}`;
                        break;
                }
            })
        })

        const krieg = await fetch('http://localhost:42069/database/krieg').then(res => res.json());

        setKrieg(krieg.frak1, krieg.frak2);
        if (krieg.stats.frak1.kills >= krieg.stats.frak1.kills) { setBestFrak({ name: krieg.frak1, kills: krieg.stats.frak1.kills }) 
        } else {{ setBestFrak({ name: krieg.frak2, kills: krieg.stats.frak2.kills }) }}

        const playerdatachart = document.getElementById("playerdatachart");
        new Chart(playerdatachart, {
            type: 'line',
            data: {
                labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
                datasets: [{
                    data: await fetch('http://localhost:42069/database/playercount').then(res => res.json()),
                    backgroundColor: color,
                    borderColor: color,
                }],
            },
            options: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                 },
                 hover: {
                    mode: 'index',
                    intersect: false
                 },
                tension: 0.45,
                pointBackgroundColor: "#00000000",
                pointBorderColor: "#00000000",
                responsive: true,
                aspectRatio: 1 | 2,
                scales: {
                    x: {
                        border: {
                            display: false
                        },
                        grid: {
                            display: false,
                            drawOnChartArea: false,
                        },
                        ticks: {
                            font: {
                                family: 'Poppins',
                                fontWeight: 500,
                                size: 14,
                            },
                            color: "white",
                        }
                    },
                    y: {
                        display: false,
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false
                    },
                }
            },
            plugins: []
        });

        const newscontainer = document.querySelector(".news-container");
        const newsitemtem = document.getElementById("newsitemtem");

        fetch("http://localhost:42069/discordapi/getnews/10").then(res => res.json()).then(gettetnews => {
            if (gettetnews.message != null) return;
            for (let i = 0; i < gettetnews.length; i++) {
                const news = gettetnews[i];
                const newTem = newsitemtem.content.cloneNode(true);
                newTem.querySelector("img").src = news.image;
                newTem.querySelector("h3").innerText = news.title;
                newTem.querySelector("p").innerText = news.date;
                newTem.addEventListener('click', () => {
                    window.location.href = news.link;
                })
                newscontainer.append(newTem);
            }
        })

        currentPage = "dashboard";
    }

    async function openFrak() {
        if (currentPage === "frak") return
        resetContent();
        content.appendChild(fraktem.content.cloneNode(true));

        content.style.background = "black";

        var fraks = await fetch('../../fraks.json').then(resp => resp.json())

        const fraktemye = document.getElementById("fraktemye");
        const frakcontainer = document.getElementsByClassName("frak-container")[0];
        const currentfrakh2 = document.getElementById("currentFrak")

        frakcontainer.innerHTML = "";

        fraks.forEach(frak => {
            const fraktem = fraktemye.content.cloneNode(true).children[0]
            fraktem.querySelector("img").src = `../img/fraktionen/${frak.name.toLowerCase()}.png`;
            fraktem.querySelector("p").innerText = frak.name;
            fraktem.querySelector("span").innerText = `(${frak.currentplayer}/${frak.maxplayer})`;
            fraktem.setAttribute("frak", frak.name.toLowerCase())
            fraktem.addEventListener('click', () => {
                currentfrakh2.innerText = frak.name;
                currentFrak = frak;
                checkIfAllValid()
                fetch('https://freeroam/setDefaultClothingOfFrak', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        clothing: currentFrak.outfits,
                        shirt: clothingnames.torso[currentFrak.outfits.body.torso[0][0]].tshirt
                    })
                });
                fetch('https://ibgw-manager/setFrak', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        frak: currentFrak
                    })
                })
            })
            frakcontainer.appendChild(fraktem);
        })

        currentPage = "frak";
    }

    async function openClothing() {
        if (currentPage === "clothing") return

        resetContent();
        content.appendChild(clothingtem.content.cloneNode(true));

        if (currentFrak.name == null) {
            document.querySelector(".button-container").style.color = "red";
            document.querySelector(".button-container").innerHTML = "<h1>Keine Fraktion ausgewählt</h1>";
            return
        }

        const clothing = currentFrak.outfits

        function idToName(type, ids) {
            return clothingnames[type][ids[0]]?.variations[ids[1]] || "Konnte nicht gefunden werden";
        }

        Object.values(clothing).forEach(type => {
            for (let i = 0; i < Object.values(type).length; i++) {
                document.getElementById(`${Object.keys(type)[i]}span`).innerText = idToName(Object.keys(type)[i], Object.values(type)[i][0]).label
            }
        })

        content.style.background = "transparent";

        fetch("https://freeroam/openedClothing", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })

        const beforebtns = document.querySelectorAll(".before");
        const afterbtns = document.querySelectorAll(".after");

        const indexes = {
            hat: 0,
            mask: 0,
            shirt: 0,
            torso: 0,
            pants: 0,
            shoes: 0
        }

        beforebtns.forEach(button => {
            button.addEventListener('click', () => {
                const btntext = button.parentElement.querySelector(".btntext");
                const targetcat = button.parentElement.parentElement.querySelector("h4").innerText.toLowerCase();
                const targetclothing = btntext.querySelector("p").innerText.toLowerCase();
                const clothingname = btntext.querySelector("span");
                const iwasdiggi = clothing[targetcat][targetclothing]
                const clothingobj = clothingnames[targetclothing][iwasdiggi[0][0]];

                if (indexes[targetclothing] === 0) return;
                indexes[targetclothing]--;
                const variationobj = clothingobj.variations[indexes[targetclothing]];
                clothingname.innerText = variationobj.label;

                fetch("https://freeroam/setClothing", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        clothing: variationobj,
                        type: targetclothing,
                        arms: clothingobj.arms || null,
                        shirt: clothingobj.tshirt || null
                    })
                })
            })
        })

        afterbtns.forEach(button => {
            button.addEventListener('click', () => {
                const btntext = button.parentElement.querySelector(".btntext");
                const targetcat = button.parentElement.parentElement.querySelector("h4").innerText.toLowerCase();
                const targetclothing = btntext.querySelector("p").innerText.toLowerCase();
                const clothingname = btntext.querySelector("span");
                const iwasdiggi = clothing[targetcat][targetclothing]
                const clothingobj = clothingnames[targetclothing][iwasdiggi[0][0]];

                if (indexes[targetclothing] === clothing[targetcat][targetclothing].length - 1) return;
                indexes[targetclothing]++;
                const variationobj = clothingobj.variations[indexes[targetclothing]];
                clothingname.innerText = variationobj.label;

                fetch("https://freeroam/setClothing", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        clothing: variationobj,
                        type: targetclothing,
                        arms: clothingobj.arms || null,
                        shirt: clothingobj.tshirt || null
                    })
                })
            })
        })

        currentPage = "clothing";
    }

    async function openSettings() {
        if (currentPage === "settings") return
        resetContent();
        content.appendChild(settingstem.content.cloneNode(true));

        settings = await fetch('https://ibgw-manager/getUserSettings').then(res => res.json());

        const settingselementtem = document.getElementById("settingselement-tem");
        const stngcontenteltem = document.getElementById("stngcontentel-tem");
        const settingscontainer = document.querySelector(".settings-container");

        settingscontainer.innerText = "";

        for (let i = 0; i < Object.keys(settings).length; i++) {
            const group = Object.keys(settings)[i];

            const nsettingselement = settingselementtem.content.cloneNode(true).children[0];
            nsettingselement.classList.add(group);
            nsettingselement.querySelector(".stng-title").innerText = settingnames[group].title;
            nsettingselement.querySelector(".stng-text").innerText = settingnames[group].description;
            const stngcontent = nsettingselement.querySelector(".stng-content");
            const dingerda = Object.keys(Object.values(settings)[i]);
            for (let j = 0; j < dingerda.length; j++) {
                const setting = dingerda[j];
                const nstngcontent = stngcontenteltem.content.cloneNode(true).children[0];
                nstngcontent.setAttribute("setting", `${group}.${setting}`);
                var yesno
                const stateyo = Object.values(Object.values(settings)[i])[j];
                if (stateyo) { yesno = "yes" } else { yesno = "no" }
                nstngcontent.classList.add(yesno);
                nstngcontent.querySelector(".stngcnt-title").innerText = settingnames[group][setting].title;
                nstngcontent.querySelector(".stngcnt-text").innerText = settingnames[group][setting].description;
                stngcontent.append(nstngcontent);
            }
            settingscontainer.append(nsettingselement);
        }

        const stngelems = document.querySelectorAll(".stng-content-element");

        stngelems.forEach(elem => {
            elem.addEventListener('click', () => {
                elem.classList.toggle("yes");
                elem.classList.toggle("no");
                const setting = elem.getAttribute("setting").split(".");
                var dingenda; 
                if (elem.classList.contains("no")) { dingenda = false; } else { dingenda = true; }
                settings[setting[0]][setting[1]] = dingenda;
                setSettings();
            })
        })

        currentPage = "settings";
    }

    function setSettings() {
        fetch("https://ibgw-manager/setsetting", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                settings: settings
            })
        })
    }

    switch (startpage) {
        case "dashboard":
            openDashboard();
            break;
        case "frak":
            openFrak();
            break;
        case "clothing":
            openClothing();
            break;
        case "settings":
            openSettings();
            break;
        default:
            openDashboard();
            console.error("Die ausgewählte Seite konnte nicht gefunden. Du wurdest zum Dashboard geleitet. Melde das einem Admin:", startpage)
            break;
    }
}

function setKrieg(frak1, frak2) {
    const kriegelement = document.querySelector(".krieg");
    kriegelement.querySelector("h2").innerText = `${capitalizeFirstLetter(frak1)} vs ${capitalizeFirstLetter(frak2)}`;
}

function setBestFrak(frakdata) {
    const bestfrakselement = document.querySelector(".bestfraks");
    bestfrakselement.querySelector("h2").innerText = `${capitalizeFirstLetter(frakdata.name)} ${frakdata.kills} Kills`
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function openCarAuswahl() {
    const carholdertem = document.getElementById("carholdertem");
    const coupessec = document.getElementById("coupessec").querySelector(".carcontainer");
    const sportsec = document.getElementById("sportsec").querySelector(".carcontainer");
    const supersec = document.getElementById("supersec").querySelector(".carcontainer");
    const bikesec = document.getElementById("bikesec").querySelector(".carcontainer");

    coupessec.innerText = "";
    sportsec.innerText = "";
    supersec.innerText = "";
    bikesec.innerText = "";

    document.querySelector(".carauswahlsec").style.display = 'block';

    const wehfunction2 = (e) => {
        if (e.key === 'Escape') {
            fetch('https://freeroam/spawnCar')
            document.querySelector(".carauswahlsec").style.display = 'none';
        }
        document.removeEventListener('keydown', wehfunction2);
    }

    document.addEventListener('keydown', wehfunction2)

    const cars = await fetch('../../cars.json').then(resp => resp.json())

    cars.forEach(async car => {
        const newcarholder = carholdertem.content.cloneNode(true).children[0]
        newcarholder.querySelector("h3").innerText = car.name;
        newcarholder.querySelector("p").innerHTML = newcarholder.querySelector("p").innerHTML + car.level
        newcarholder.querySelector(".stats").children[0].querySelector(".statbar").setAttribute("statvalue", car.stats.acceleration.toString())
        newcarholder.querySelector(".stats").children[1].querySelector(".statbar").setAttribute("statvalue", car.stats.speed.toString())
        newcarholder.querySelector(".stats").children[2].querySelector(".statbar").setAttribute("statvalue", car.stats.handling.toString())

        const userstats = await fetch(`https://${GetParentResourceName()}/getUserStats`).then(res => res.json());

        newcarholder.querySelector(".exitcar").addEventListener('click', () => {
            fetch('https://freeroam/spawnCar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ car: car, stats: userstats })
            }).then(resp => resp.json()).then(resp => {
                if (resp) {
                    document.querySelector(".carauswahlsec").style.display = 'none';
                }
                return
            })
        })

        switch(car.type) {
            case "coupes":
                coupessec.append(newcarholder)
                break
            case "sports":
                sportsec.append(newcarholder)
                break
            case "super":
                supersec.append(newcarholder)
                break
            case "bike":
                bikesec.append(newcarholder)
                break
        }
    })

    document.querySelectorAll(".statbar").forEach(bar => {
        bar.style.setProperty('--width', `${bar.getAttribute("statvalue")}%`)
    })
}

const notifycontainer = document.querySelector(".notify-container");
const notifytem = document.querySelector("#notifytem");

function openFrakcreator() {
    document.querySelector(".frakcreator-section").style.display = 'block';

    var inputs = document.querySelectorAll("input");

    inputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.classList.contains("number")) {
                const value = parseInt(input.value);
                if (value.toString() !== "NaN") {
                    console.log(value.toString());
                    input.classList.add("valid");
                } else {
                    input.classList.add("notvalid");
                }
                return
            }
            if (input.classList.contains("array")) {
                const newSpan = document.createElement("span")
                newSpan.innerText = input.value + ", "
                input.parentElement.insertBefore(newSpan, input.parentElement.children[input.parentElement.children.length - 1])
                input.value = "";
                return
            }
            input.classList.add("valid")
        })
        input.addEventListener("input", () => {
            input.classList.remove("valid")
            input.classList.remove("notvalid")
        })
    })

    const erstellenbtn = document.getElementById("frakerstellen");

    erstellenbtn.addEventListener("click", () => {
        const frak = {
            name: elem("name").value,
            maxmember: elem("maxmember").value,
            outfits: {
                head: {
                    hat: toIntArray(elem("hatvariants")),
                    mask: toIntArray(elem("maskvariants"))
                },
                body: {
                    shirt: toIntArray(elem("shirtvariants")),
                    pullover: toIntArray(elem("pullovervariants"))
                },
                legs: {
                    pants: toIntArray(elem("pantsvariants"))
                },
                feet: {
                    shoes: toIntArray(elem("shoesvariants"))
                }
            },
            car: {
                primaryColor: elem("primcolor").value,
                secondaryColor: elem("secondcolor").value
            },
            coords: {
                playerspawn: toArray(elem("playerspawns")),
                carspawns: toArray(elem("carspawns"))
            }
        }
        fetch("https://freeroam/createFrak", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                frak: frak
            })
        })
        document.querySelector(".frakcreator-section").style.display = 'none';
    })

    function elem(id) {
        return document.getElementById(id)
    }

    function toArray(string) {
        var firstWord = string.parentElement.innerText.replace(/ .*/,'');
        var items = string.parentElement.innerText.replace(firstWord, "").replace("[", "").replace("]", "").replace(/\s/g, '');
        var array = items.split(",").slice(0, -1);
        return array;
    }

    function toIntArray(string) {
        var firstWord = string.parentElement.innerText.replace(/ .*/,'');
        var items = string.parentElement.innerText.replace(firstWord, "").replace("[", "").replace("]", "").replace(/\s/g, '');
        var badarray = items.split(",").slice(0, -1);
        var goodarray = [];
        for (let i = 0; i < badarray.length; i++) {
            goodarray.push(parseInt(badarray[i]))
        }
        return goodarray;
    }
}

function openTestClothing() {
    document.querySelector(".testclothingsec").style.display = 'block';

    const buttonholders = document.querySelectorAll(".button-holder")
    
    var indexes = {
        clothing: 0,
        variation: 0
    }

    buttonholders.forEach(buttonholder => {
        buttonholder.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                if (button.classList.contains("before")) {
                    if (buttonholder.classList.contains("variation")) {
                        indexes.variation--;
                    } else {
                        indexes.clothing--;
                    }
                } else if (button.classList.contains("after")) {
                    if (buttonholder.classList.contains("variation")) {
                        indexes.variation++;
                    } else {
                        indexes.clothing++;
                    }
                }
                document.getElementById("clothingtestp").innerText = indexes.clothing;
                document.getElementById("clothingtestvarp").innerText = indexes.variation;

                fetch("https://freeroam/setTestClothing", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        indexes: indexes
                    })
                })
            })
        })
    })
}