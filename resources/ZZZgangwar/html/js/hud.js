const id = document.getElementById("id").querySelector("span")
const kills = document.getElementById("kills").querySelector("span")
const deaths = document.getElementById("deaths").querySelector("span")
const kd = document.getElementById("kd").querySelector("span")
const level = document.getElementById("level").querySelector("span")

function updateHUD() {
    fetch(`https://gangwar/getPlayerData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: {
            weh: "test"
        }
    }).then(resp => resp.json()).then(stats => {
        console.log(stats);
        id.innerText = stats.id
        kills.innerText = stats.kills
    })
}

// .then(resp => resp.json()).then(resp => console.log(4, resp));

updateHUD()