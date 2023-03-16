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
    console.log(frak);
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