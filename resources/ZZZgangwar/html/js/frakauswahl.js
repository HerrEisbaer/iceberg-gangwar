const frakFarben = {
    bloods: "255, 0, 0",
    grove: "0, 255, 0",
    lcn: "0, 0, 0",
    mg13: "173, 216, 230",
    police: "60, 60, 255",
    triaden: "0, 0, 255",
    vagos: "255, 255, 0"
}

const defaultCars = ["schafter2", "revolter", "bf400"]

var currentFrak = null
var currentFrakName = null

//amk

const fraktem = document.querySelector("#frak-tem")

//Page switchen und so

const maincontent = document.querySelector(".main-content")

function clearMain() {
    maincontent.innerHTML = ""
}

const headerbuttons = document.querySelectorAll(".content-element")
var currentPage = headerbuttons[0]

headerbuttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button == currentPage) return
        currentPage.classList.remove("active")
        button.classList.add("active")
        currentPage = button
        clearMain()
        switch (button.id) {
            case "frakauswahl":
                openFraks()
                break
            case "outfit":
                openOutfits()
                break
            case "fahrzeugauswahl":
                openCars()
                break
        }
    })
})

//Frakmenu

const fraks = document.getElementById("fraks-container")

function openFraks() {
    fetch(`https://gangwar/getAlleFraks`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    }
    }).then(resp => resp.json()).then(resp => {
        const frakcontainer = document.querySelector(".frak-container")
        resp.forEach(ding => {
            const frak = ding._doc
            const newFrak = fraktem.content.cloneNode(true).children[0]
            newFrak.setAttribute("frak", frak.name.toLowerCase())
            newFrak.querySelector("img").src = `img/fraktionen/${frak.name.toLowerCase()}.png`
            newFrak.querySelector("p").innerText = frak.name.charAt(0).toUpperCase() + frak.name.slice(1)
            newFrak.querySelector("span").innerText = `(10/${frak.maxmember})`
            frakcontainer.append(newFrak)
        })
        getAllFraks()
    });
    const allfrak = fraks.content.cloneNode(true).children[0]
    maincontent.append(allfrak)
}

function getAllFraks() {
    var frakelems = document.querySelectorAll(".frak")
    frakelems.forEach(frak => {
        frak.addEventListener('click', () => {
            currentFrak = frak.getAttribute("frak")
            updateFrak()
            fetch(`https://gangwar/setFrak`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    frak: currentFrakName
                })
            })
        })
    });
}

function updateFrak() {
    const currentfrakh2 = document.getElementById("currentFrak")
    const jojo = document.documentElement.style
    jojo.setProperty("--text-color", "black")
    switch (currentFrak) {
        case null:
            currentFrakName = "Nichts"
            jojo.setProperty("--effectcolorrgb", "255, 255, 255")
            break
        case "bloods":
            currentFrakName = "Bloods"
            jojo.setProperty("--effectcolorrgb", frakFarben.bloods)
            break
        case "grove":
            currentFrakName = "Grove"
            jojo.setProperty("--effectcolorrgb", frakFarben.grove)
            break
        case "lcn":
            currentFrakName = "LCN"
            jojo.setProperty("--effectcolorrgb", frakFarben.lcn)
            jojo.setProperty("--text-color", "white")
            break
        case "mg13":
            currentFrakName = "MG13"
            jojo.setProperty("--effectcolorrgb", frakFarben.mg13)
            break
        case "police":
            currentFrakName = "Police"
            jojo.setProperty("--effectcolorrgb", frakFarben.police)
            break
        case "triaden":
            currentFrakName = "Triaden"
            jojo.setProperty("--effectcolorrgb", frakFarben.triaden)
            break
        case "vagos":
            currentFrakName = "Vagos"
            jojo.setProperty("--effectcolorrgb", frakFarben.vagos)
            break
    }
    currentfrakh2.innerText = currentFrakName
}

//Outiftmenu

var currentOutfit = null

const outfittem = document.getElementById("outfittem")
const outfititemtem = document.getElementById("outfititemtem")

function openOutfits() {
    const outfitcontent = outfittem.content.cloneNode(true).children[0]
    maincontent.append(outfitcontent)
    const outfitscontainer = document.querySelector(".outfits-container")
    const outiftconth2 = document.querySelector(".outiftcont-h2")
    if (currentFrak == null) {
        outiftconth2.innerText = "Keine Fraktion ausgewählt."
        return
    }
    fetch(`https://gangwar/getOutifts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    }).then(resp => resp.json()).then(outfits => {
        outfits[currentFrak].forEach(outfit => {
            const newOutfit = outfititemtem.content.cloneNode(true).children[0]
            newOutfit.querySelector("img").src = `img/fraktionen/kleidung/${currentFrak}/${outfit}.png`
            newOutfit.querySelector("p").innerText = `Outfit ${outfits[currentFrak].indexOf(outfit) + 1}`
            newOutfit.addEventListener('click', () => {
                currentOutfit = parseInt(newOutfit.querySelector("p").innerText.replace("Outfit ", ""))
                updateCurrentOutfit()
            })
            outfitscontainer.append(newOutfit)
        })
    })
    updateCurrentOutfit()

    function updateCurrentOutfit() {
        if (currentOutfit == null) {
            outiftconth2.innerText = "Kein Outfit ausgewählt."
        } else {
            outiftconth2.innerText = `Akutelles Outfit: ${currentOutfit}`
        }    
    }
}

//Carmenu

const carmenutem = document.getElementById("carmenutem")
const caritem = document.getElementById("caritemtem")

function openCars() {
    const carmenucontent = carmenutem.content.cloneNode(true).children[0]
    maincontent.append(carmenucontent)
    const carscontainer = document.querySelector(".cars-container")
    if (currentFrak == null) {
        carscontainer.innerText = "Keine Fraktion ausgewählt."
        return
    }
    defaultCars.forEach(car => {
        const newCar = caritem.content.cloneNode(true).children[0]
        newCar.querySelector("img").src = `img/cars/${car}`
        newCar.querySelector("p").innerText = car
        newCar.addEventListener('click', () => {
            fetch(`https://gangwar/postFrakData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    frak: currentFrakName,
                    outfit: currentOutfit,
                    car: car
                })
            })
        })
        carscontainer.append(newCar)
    })
}

openFraks()