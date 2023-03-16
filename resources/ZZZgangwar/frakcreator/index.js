const name = document.getElementById("Name")
const maxmember = document.getElementById("maxmember")
const outfits = document.getElementById("outfits")
const cars = document.getElementById("cars")
const coords = document.getElementById("coords")

document.querySelector("button").addEventListener('click', () => {
    fetch(`https://gangwar/createFrak`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            name: name.value,
            maxmember: parseInt(maxmember.value),
            outfits: outfits.value.split(","),
            cars: JSON.parse(cars.value),
            coords: JSON.parse(coords.value)
        })
    })
})