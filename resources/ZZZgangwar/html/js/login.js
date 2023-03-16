document.querySelector("button").addEventListener('click', () => {
    const un = document.getElementById("username")
    const pw = document.getElementById("password")
    if (un.value.length <= 0 && pw.value.length <= 0) {
        // Hier würde Alert hinkommen
        fetch(`https://gangwar/addNotify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                title: "Fehler",
                text: "Passwort und/oder Username ist ungültig."
            })
        })
        return
    }
    fetch(`https://gangwar/postInputdata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            username: un.value,
            password: pw.value
        })
    })
})