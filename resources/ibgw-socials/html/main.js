const allsocials = document.querySelector(".allsocials-container");

allsocials.style.display = "none";

var openfriendbtn = document.getElementById("openfriend");
var openpartysbtn = document.getElementById("openpartys");
var openteamsbtn = document.getElementById("openteams");

window.addEventListener('message', (e) => {
    switch (e.data.type) {
        case "showSocials":
            allsocials.style.display = "block";
            openfriendbtn = document.getElementById("openfriend");
            openpartysbtn = document.getElementById("openpartys");
            openteamsbtn = document.getElementById("openteams");

            // getAllFriends();
            // openFriendsMenu();

            openfriendbtn.addEventListener('click', () => {
                clearOverlay(openfriendbtn)
            });

            openpartysbtn.addEventListener('click', () => {
                clearOverlay(openpartysbtn)
            });

            openteamsbtn.addEventListener('click', () => {
                clearOverlay(openteamsbtn)
            });
            break;
        case "hideSocials":
            allsocials.innerHTML = "";
            allsocials.append(document.getElementById("overlaytem").content.cloneNode(true).children[0]);
            allsocials.style.display = "none";
    }
})

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

// allsocials.append(friendstem.content.cloneNode(true).children[0]);

function clearOverlay(button) {
    const overlayel = document.querySelector(".overlay");
    // const wellenundsoel = document.querySelector(".wellenundso");
    const slider = document.querySelector(".slider");
    const sobodenel = document.querySelector(".soboden");

    const friendstem = document.getElementById("friendstem");
    const partytem = document.getElementById("partytem");
    const teamstem = document.getElementById("teamstem");

    button.disabled = "true";
    button.classList.add("jamanwoohuuu");
    sobodenel.classList.add("gehwegboden");
    const otherbtns = printOtherElements([openfriendbtn, openpartysbtn, openteamsbtn], button)
    if (typeof otherbtns === "object") {
        otherbtns.forEach(btn => {
            btn.classList.add("buttongeht");
        })
    }

    setTimeout(() => {
        slider.style.display = "block";
        setTimeout(() => {
            switch (button.innerText) {
                case "FREUNDE":
                    // openFriendsMenu();
                    getAllFriends();
                    break
                case "PARTYS":
                    openPartyMenu();
                    break;
                case "TEAMS":
                    allsocials.append(teamstem.content.cloneNode(true).children[0]);
                    break;
                default:
                throw new Error(`auto machen so ich machen so aber unfall: ${button.innerText}`);
            }
            setTimeout(() => {
                slider.style.display = "none";
            }, 2000);
        }, 2000);
    }, 2000);
}

var friends = [];

async function getAllFriends() {
    friends = [];
    var ownname = await fetch('https://ibgw-manager/getOwnName').then(res => res.json());
    const foundfriends = await fetch(`http://localhost:42069/database/getAllfriends/${ownname}`).then(res => res.json());
    // console.log(await fetch(`http://localhost:42069/database/getAllfriends/${ownname}`).then(res => res.json()));
    if (foundfriends.length === 0) { console.log(1000111); openFriendsMenu(); return}
    foundfriends.forEach(async friend => {
        friends.push({
            name: friend.name,
            status: friend.status,
            currentFrak: "Vagos",
            imgurl: (await fetch(`http://localhost:42069/discordapi/getuser/${friend.discord}`).then(res => res.json())).displayAvatarURL
        })
        if (friends.length === foundfriends.length) {
            openFriendsMenu();
        }
    })
}

const groups = {
    user: {
        displayname: "User",
        img: ""
    },
    friend: {
        displayname: "Freund",
        img: "friend.png"
    },
    team: {
        displayname: "Teamler",
        img: "team.png"
    },
    supporter: {
        displayname: "Supporter",
        img: ""
    },
    moderator: {
        displayname: "Moderator",
        img: ""
    },
    admin: {
        displayname: "Admin",
        img: ""
    },
    owner: {
        displayname: "Owner",
        img: "owner.png"
    },
    place1: {
        displayname: "#1",
        img: "crown.png"
    }
}

var controller = new AbortController();
var signal = controller.signal;

const partytem = document.getElementById("partytem");

function openPartyMenu() {
    allsocials.innerHTML = "";
    allsocials.append(partytem.content.cloneNode(true).children[0]);

    document.getElementById("partyidbtn").addEventListener('click', soAddPartyBtnEvent)

    async function soAddPartyBtnEvent() {
        // openParty()
        let value = document.getElementById("partyidinput").value;
        value = parseInt(value);
        if (value == null) return;
        setPartyPending();
        const ergebnis = await fetch(`http://localhost:42069/discordapi/isPartyExisting/${value}`).then(res => res.json());
        if (!ergebnis) { setPartyZurückWeilFehler("Party ID ist ungültig"); return };
        const ownid = await fetch('https://ibgw-manager/getDiscordId').then(res => res.json());
        const hasRequest = await fetch(`http://localhost:42069/discordapi/checkForPartyRequest/${ownid}`).then(res => res.json());
        if (hasRequest) { setPartyZurückWeilFehler(`Du hast noch eine Anfrage offen. Warte ${60 - (Math.floor(new Date()/1000) - hasRequest.date)} Sekunden.`); return }
        controller = new AbortController();
        signal = controller.signal;
        let successfull = await fetch(`http://localhost:42069/discordapi/partyRequest/${value}/${ownid}`, { signal: signal }).then(res => res.json()).catch(error => {});
        let acceptet = false;
        do {
            await Delay(1000);
            const currentState = await fetch(`http://localhost:42069/discordapi/checkIfPartyRequestIsAcceptet/${ownid}`).then(res => res.json());
            if (currentState != acceptet) {
                setPartyZurückWeilFehler("Party Anfrage angenommen.")
                openParty();
                acceptet = true;
            }
        } while (!acceptet);
        console.log(successfull);
    }

    function setPartyPending() {
        const partyinvitewarten = document.getElementById("partyinvitewarten");
        const partycontainer = document.querySelector(".party-container");
        partycontainer.innerHTML = "";
        partycontainer.append(partyinvitewarten.content.cloneNode(true).children[0]);
        var found = false;
        const unserh2 = document.querySelector(".wehkrankh2");
        let dots = ".";
        let count = 1;
        const intervalId = setInterval(() => {
            if (count === 1) {
                dots = ".";
            } else if (count === 2) {
                dots = "..";
            } else {
                dots = "...";
                count = 0;
            }
            unserh2.innerText = `Party Invite Ausstehend${dots}`;
            count++;
            if (found) {
                clearInterval(intervalId);
            }
        }, 500);
    }

    function setPartyZurückWeilFehler(message) {
        const partycontainer = document.querySelector(".party-container");
        partycontainer.innerHTML = "";
        partycontainer.append(partytem.content.cloneNode(true).children[0].querySelector(".input-ctn"));
        document.getElementById("partyidbtn").addEventListener('click', soAddPartyBtnEvent)
        fetch(`https://ibgw-hud/addNotify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                title: "Fehler",
                text: message
            })
        })
    }

    // openParty()
}

const onepartytem = document.getElementById("onepartytem");

function openParty() {
    const partycontainer = document.querySelector(".party-container");
    partycontainer.innerHTML = "";
    partycontainer.append(onepartytem.content.cloneNode(true).children[0])

    document.querySelector(".leavepartysvg").addEventListener('click', () => {
        console.log("Leave Party");
    })
}

const friendtem = document.getElementById("friendtem");
const ergebnissetzentem = document.getElementById("ergebnissetzentem");
const roletem = document.getElementById("roletem");

var friendsOpened = false;

async function openFriendsMenu() {
    allsocials.innerHTML = "";
    const friendstemneu = document.getElementById("friendstem");
    allsocials.append(friendstemneu.content.cloneNode(true).children[0]);

    const ergebnisse = document.querySelector(".ergebnisse");
    friendsOpened = true;
    displayAllFriends();
    
    function displayAllFriends() {
        const allfriendscontainer = document.querySelector(".allfriends-container");
        const friendtem = document.getElementById("friendtem");
        allfriendscontainer.innerHTML = "";
        friends.forEach(friend => {
            const newfriend = friendtem.content.cloneNode(true).children[0];
            newfriend.querySelector("img").src = friend.imgurl;
            const h3 = newfriend.querySelector("h3");
            h3.innerHTML = `${friend.name}${h3.innerHTML}`;
            newfriend.querySelector("span").setAttribute("status", friend.status);
            newfriend.querySelector("p").innerText = friend.currentFrak;
            allfriendscontainer.append(newfriend);
        });

        document.querySelectorAll('.freundesvg').forEach(svg => {
            svg.addEventListener('click', () => {
                setErgebnis(svg.parentElement.querySelector("h3").innerText);
            });
        });
    }

    const ergebnisauflistentem = document.getElementById("ergebnisauflistentem");
    const playerergebnissuchetem = document.getElementById("playerergebnissuchetem");

    const searchinput = document.querySelector(".searchfriendsinput");

    searchinput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            getAllSuchen(searchinput.value);
        }
    })

    document.querySelector(".playersearchicon").addEventListener('click', () => {
        getAllSuchen(searchinput.value);
    })

    async function getAllSuchen(nameToLook) {
        ergebnisse.innerHTML = "";
        const newergebnisauflistentem = ergebnisauflistentem.content.cloneNode(true).children[0];
        const ergebniscontainer = newergebnisauflistentem.querySelector(".alleergebnisselg");
        const allUsers = await fetch(`http://localhost:42069/database/getAllUser/${nameToLook.toLowerCase()}`, { method: 'GET', }).then(res => res.json());
        allUsers.forEach(async user => {
            const newusertem = playerergebnissuchetem.content.cloneNode(true).children[0];
            console.log(user);
            newusertem.querySelector("img").src = (await fetch(`http://localhost:42069/discordapi/getuser/${user.userinfo.identifiers.discord}`).then(res => res.json())).displayAvatarURL;
            const h3 = newusertem.querySelector("h3");
            h3.innerHTML = `${user.userinfo.name}${h3.innerHTML}`;
            newusertem.querySelector("p").innerText = "Vagos";
            newusertem.querySelector("svg").addEventListener("click", () => {
                setErgebnis(user.userinfo.name);
            })
            ergebniscontainer.append(newusertem);
        })
        ergebnisse.append(newergebnisauflistentem);
    }

    async function setErgebnis(playername) {
        ergebnisse.innerHTML = "";
        var exit = false;
        var user = {};
        const ergebnis = await fetch(`http://localhost:42069/database/findUser/${playername}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "Access-Control-Allow-Origin": "http://localhost:42069",
                "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
            }
        }).then(async res => {
            if (res.status === 404) {
                console.log("huge error hier dingens nh:", playername);
                exit = true;
                return;
            }
            user = await res.json();
        })
        if (exit) return;
        const newergebnis = ergebnissetzentem.content.cloneNode(true).children[0];
        newergebnis.querySelector("h2").innerText = user.userinfo.name;
        const datakills = newergebnis.querySelector("[data-kills]");
        const datadeaths = newergebnis.querySelector("[data-deaths]");
        const datakd = newergebnis.querySelector("[data-kd]");
        const datalevel = newergebnis.querySelector("[data-level]");
        datakills.innerHTML = `${datakills.innerHTML}${user.stats.kills}`;
        datadeaths.innerHTML = `${datadeaths.innerHTML}${user.stats.deaths}`;
        datakd.innerHTML = `${datakd.innerHTML}${(Math.round((user.stats.kills / user.stats.deaths) * 100)/100).toFixed(2)}`;
        datalevel.innerHTML = `${datalevel.innerHTML} ${user.stats.kills}`;
        const frakname = newergebnis.querySelector("[data-name]").querySelector("span");
        const frakrang = newergebnis.querySelector("[data-rang]").querySelector("span");
        const frakplatz = newergebnis.querySelector("[data-platz]").querySelector("span");
        const frakmember = newergebnis.querySelector("[data-member]").querySelector("span");
        frakname.innerText = user.team.name || "Kein Team";
        if (user.team.name) {
            frakrang.innerHTML = "weh";
            frakplatz.innerHTML = "suiii";
            frakmember.innerHTML = "187";
        } else {
            frakrang.parentElement.remove();
            frakplatz.parentElement.remove();
            frakmember.parentElement.remove();
        }
        user.groups.forEach(group => {
            if (group == "user") return;
            if (groups[group] == null) return;
            const namenundso = groups[group];
            const newrole = roletem.content.cloneNode(true).children[0];
            newrole.querySelector("img").src = `icons/roles/${namenundso.img}`;
            newrole.innerHTML = `${newrole.innerHTML}${namenundso.displayname}`;
            newergebnis.querySelector("h2").append(newrole);
        })
        newergebnis.querySelector("#addAsFriend").onclick = async () => {
            console.log("freund hinzufügend");
            const ownid = await fetch('https://ibgw-manager/getDiscordId').then(res => res.json());
            fetch(`http://localhost:42069/discordapi/addFriend/${ownid}/${user.userinfo.identifiers.discord}`, { method: "PUT" })
        }
        newergebnis.querySelector("#addToParty").onclick = () => {
            console.log("party add lmao");
        }
        newergebnis.querySelector("#inivteToTeam").onclick = () => {
            console.log("das wird niemals gehen");
        }
        ergebnisse.append(newergebnis);
    }

    do {
        await Delay(2000);
        if (!friendsOpened) break;
        friends = [];
        var ownname = await fetch('https://ibgw-manager/getOwnName').then(res => res.json());
        const foundfriends = await fetch(`http://localhost:42069/database/getAllfriends/${ownname}`).then(res => res.json());
        if (foundfriends.length === 0) { displayAllFriends(); continue; };
        for (const friend of foundfriends) {
            friends.push({
                name: friend.name,
                status: friend.status,
                currentFrak: "Vagos",
                imgurl: (await fetch(`http://localhost:42069/discordapi/getuser/${friend.discord}`).then(res => res.json())).displayAvatarURL
            })
        }
        if (!friendsOpened) break;
        displayAllFriends();
    } while (friendsOpened);
}

function printOtherElements(array, element) {
    if (array.includes(element)) {
      return array.filter(e => e !== element);
    }
    return "Element not found in the array";
}

// openFriendsMenu();
// openPartyMenu();

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        fetch('https://ibgw-socials/leavesocials');
        allsocials.style.display = "none";
        friends = [];
        friendsOpened = false;

        controller.abort();

        return;
    }
})