var progressbar = null;

window.addEventListener('message', (e) => {
    switch (e.data.type) {
        case "showHUD":
            showHUD();
            break;
        case "hideHUD":
            document.querySelector(".hudsec").style.display = 'none';
            break;
        case "addNotify":
            addNotify(e.data.title, e.data.text);
            break;
        case "addAlert":
            addAlert(e.data.title, e.data.text);
            break;
        case "progresbar":
            setProgressbar(e.data.title);
            break;
        case "prgbarabbr":
            progressbar.remove();
            break;
    }
})

showHUD();

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

// document.querySelector(".hudsec").style.display = 'none';

const weaponel = document.getElementById("weapon");
const ammoel = document.getElementById("ammo");

async function showHUD() {
    document.querySelector(".hudsec").style.display = 'block';
    fetch('https://ibgw-manager/getUserStats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    })
    .then(res => res.json()).then(res => {
        document.getElementById("hudkills").innerText = `Kills: ${res.kills}`;
        document.getElementById("huddeaths").innerText = `Deaths: ${res.deaths}` ;
        document.getElementById("hudkd").innerText = `K/D: ${(res.kills/res.deaths).toFixed(2)}`;
        document.getElementById("hudlevel").innerText = `Level: ${res.level.level}`;
    })
    fetch(`https://ibgw-manager/getPlayerID`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    }).then(res => res.json()).then(res => document.getElementById("hudid").innerText = `ID: ${res}`)
}

const notifycontainer = document.querySelector(".notify-container");
const notifytem = document.querySelector("#notifytem");

function addNotify(title, text) {
    const newnotify = notifytem.content.cloneNode(true).children[0];
    newnotify.querySelector("h2").innerText = title;
    newnotify.querySelector("p").innerText = text;
    notifycontainer.append(newnotify)
    setTimeout(() => {
        newnotify.style.animation = "slideoutleft 1s";
        setTimeout(() => {
            newnotify.remove()
        }, 1000);
    }, 5000);
}

const alertcontainer = document.querySelector(".alert-container");
const alerttem = document.querySelector("#alerttem");

function addAlert(title, text) {
    const newalert = alerttem.content.cloneNode(true).children[0];
    newalert.querySelector("h2").innerText = title;
    newalert.querySelector("p").innerText = text;
    alertcontainer.append(newalert)
    setTimeout(() => {
        newalert.style.animation = "slideintop 1s reverse";
        setTimeout(() => {
            newalert.remove()
        }, 1000);
    }, 5000);
}

async function setProgressbar(title) {
    const prgbarsec = document.querySelector(".progressbarsec");
    prgbarsec.style.display = "block";

    progressbar = document.createElement("div");
    progressbar.classList.add('progressbarctn');
    progressbar.title = title;

    prgbarsec.append(progressbar)
    await Delay(2500);
    progressbar.style.transition = "1s";
    progressbar.style.transform = "translate(-50%, 200%)";
    await Delay(1000);
    progressbar.remove();
}