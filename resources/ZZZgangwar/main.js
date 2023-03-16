window.addEventListener('message', (e) => {
    switch (e.data.type) {
        case "openLogin":
            const loginpage = document.querySelector("#logintem").content.cloneNode(true).children[0]
            document.querySelector("body").append(loginpage)
            break
        case "closeLogin":
            document.querySelector("#logindiv").remove()
            break
        case "openMainMenu":
            const mainmenupage = document.querySelector("#mainmenutem").content.cloneNode(true).children[0]
            document.querySelector("body").append(mainmenupage)
            break
        case "closeMainMenu":
            document.querySelector("#mainmenudiv").remove()
            break
        case "showHUD":
            const maybediv = document.querySelector('.huddiv')
            if (!(maybediv == null)) maybediv.remove()
            const hud = document.querySelector("#hudtem").content.cloneNode(true).children[0]
            document.querySelector("body").append(hud)
            id = document.getElementById("id").querySelector("span")
            kills = document.getElementById("kills").querySelector("span")
            deaths = document.getElementById("deaths").querySelector("span")
            kd = document.getElementById("kd").querySelector("span")
            level = document.getElementById("level").querySelector("span")
            updateHUD()
            break
        case "hideHUD":
            document.querySelector("#huddiv").remove()
            break
        case "updateHUD":
            updateHUD()
            break
        case "addnotify":
            addNotify(e.data.title, e.data.text)
            break
        case "openFrakcreator":
            document.querySelector("body").append(document.querySelector("#frakcreatortem").content.cloneNode(true).children[0])
            break
        case "closeFrakcreator":
            document.querySelector("#frakcreatordiv").remove()
            break
    }
})

function updateHUD() {
    console.log("HUD Updated");
    const id = document.getElementById("id").querySelector("span")
    const kills = document.getElementById("kills").querySelector("span")
    const deaths = document.getElementById("deaths").querySelector("span")
    const kd = document.getElementById("kd").querySelector("span")
    const level = document.getElementById("level").querySelector("span")

    fetch('https://gangwar/getPlayerStats', {
        method: 'POST'
    }).then(resp => resp.json()).then(resp => {
        var nkd
        if (resp.kills === 0 || resp.deaths === 0) {
            nkd = 0   
        } else {
            nkd = resp.kills/resp.deaths
        }
        id.innerText = resp.id
        kills.innerText = resp.kills
        deaths.innerText = resp.deaths
        kd.innerText = nkd
        level.innerText = resp.level.level
    })
}

function addNotify(title, text) {
    const newNotify = document.getElementById("notifytem").content.cloneNode(true).children[0]
    newNotify.querySelector("h2").innerText = title
    newNotify.querySelector("p").innerText = text
    document.querySelector(".notifys").append(newNotify)

    setTimeout(() => {
        newNotify.remove()
    }, 5000)
}