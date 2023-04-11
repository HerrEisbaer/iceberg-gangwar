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

var partyMenuOpened = false;
var partyBefore = false;
var partyLeft = false;
var partybeforeOBJ = {};

async function openPartyMenu() {
    allsocials.innerHTML = "";
    allsocials.append(partytem.content.cloneNode(true).children[0]);

    partyMenuOpened = true;

    document.getElementById("partyidbtn").addEventListener('click', soAddPartyBtnEvent);
    document.getElementById("createpartybtn").addEventListener('click', openCreateParty);

    const createpartytemplate = document.getElementById("createpartytemplate");

    function openCreateParty() {
        const partycontainer = document.querySelector(".party-container");

        partycontainer.innerHTML = "";
        partycontainer.append(createpartytemplate.content.cloneNode(true).children[0]);

        const settings = {
            "allowrq": {
                name: "allowrq",
                displayName: "Allow Requests",
                value: true
            },
            "allowotherinvites": {
                name: "allowotherinvites",
                displayName: "Allow Invites by Others",
                value: false
            }
        }

        const settingtem = document.getElementById("partysettingtem");
        const settingcontainer = document.querySelector(".partysettings").querySelector(".partycontent");

        for (i = 0; i < Object.keys(settings).length; i++) {
            const setting = Object.values(settings)[i];
            const settingctn = settingtem.content.cloneNode(true).children[0];

            settingctn.querySelector("p").innerText = setting.displayName;
            settingctn.classList.add(setting.name);
            settingctn.querySelector("input").checked = setting.value;
            settingcontainer.append(settingctn);
        }

        const searchbtn = document.getElementById("preinvitesearch");
        
        searchbtn.addEventListener("change", async () => {
            if (searchbtn.value == null || searchbtn.value.trim().length == 0) return;
            const result = await fetch(`http://localhost:42069/database/userExists/${searchbtn.value}`).then(res => res.json());
            if (result == false) {
                addNotify("Fehler", "Der eingebene Name ist falsch.");
                return;
            };
            const index = partymember.indexOf(searchbtn.value);
            if (index > -1) { addNotify("Fehler", "Du hast diesen User bereits auf der AutoInvite Liste."); return; }
            const indextwo = blocked.indexOf(searchbtn.value);
            if (indextwo > -1) { addNotify("Fehler", "Du hast diesen User bereits auf der Block Liste."); return; }
            addMemberToAutoList(searchbtn.value);
            searchbtn.value = "";
        })

        const membertem = document.getElementById("partymembertem");
        const membercontainer = document.querySelector(".preInvitectn").querySelector(".partycontent");

        const partymember = [];
        
        function addMemberToAutoList(name) {
            const member = membertem.content.cloneNode(true).children[0];
            member.querySelector("img").src = "https://cdn.discordapp.com/avatars/859436564047331369/442e94d3631fac40b3c38aa64705243b.png?size=1024";
            member.querySelector("h3").innerText = name;

            member.addEventListener('click', () => {
                const index = partymember.indexOf(name);
                if (index > -1) {
                    partymember.splice(index, 1);
                }
                member.remove();
            })

            partymember.push(name)
            membercontainer.append(member);
        }

        const blocked = [];

        const blocksearch = document.getElementById("blocksearch");
        const blockedcontainer = document.querySelector(".createParty").querySelector(".partycontent");

        blocksearch.addEventListener("change", async () => {
            if (blocksearch.value == null || blocksearch.value.trim().length == 0) return;
            const result = await fetch(`http://localhost:42069/database/userExists/${blocksearch.value}`).then(res => res.json());
            if (result == false) {
                // fetch(`https://ibgw-hud/addNotify`, {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         title: "Fehler",
                //         text: "Der eingebene Name ist falsch."
                //     })
                // });
                addNotify("Fehler", "Der eingebene Name ist falsch.");
                return;
            };
            const index = blocked.indexOf(blocksearch.value);
            if (index > -1) { addNotify("Fehler", "Du hast diesen User bereits auf der Block Liste."); return; }
            const indextwo = partymember.indexOf(blocksearch.value);
            if (indextwo > -1) { addNotify("Fehler", "Du hast diesen User bereits auf der AutoInvite Liste."); return; }
            const member = membertem.content.cloneNode(true).children[0];
            member.querySelector("img").src = "https://cdn.discordapp.com/avatars/859436564047331369/442e94d3631fac40b3c38aa64705243b.png?size=1024";
            member.querySelector("h3").innerText = blocksearch.value;
            
            const name = blocksearch.value;
            member.addEventListener('click', () => {
                const index = blocked.indexOf(name);
                if (index > -1) {
                    blocked.splice(index, 1);
                }
                member.remove();
            })

            blocked.push(blocksearch.value)
            blocksearch.value = "";
            blockedcontainer.append(member);
        })

        const partyerstellenbtn = document.getElementById("createpartyfinally");

        partyerstellenbtn.addEventListener("click", async () => {
            getAllSettings();
            const ownid = await fetch('https://ibgw-manager/getDiscordId').then(res => res.json());
            fetch('https://ibgw-socials/createParty', {
                method: "POST",
                body: JSON.stringify({
                    partyobj: {
                        owner: ownid,
                        members: [(await fetch(`http://localhost:42069/database/getNameFromDiscord/${ownid}`).then(res => res.json())).name],
                        blocked: blocked,
                        autoinvites: partymember,
                        options: settings
                    }
                })
            })
        })

        function getAllSettings() {
            const allOptionElements = document.querySelectorAll(".checkbox");
            allOptionElements.forEach(element => {
                settings[element.parentElement.parentElement.classList[1]] = !element.checked;
            })
        }
    }

    async function soAddPartyBtnEvent() {
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
                openParty(value);
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
        if (partycontainer) {
            partycontainer.innerHTML = "";
            partycontainer.append(partytem.content.cloneNode(true).children[0].querySelector(".input-ctn"));
            document.getElementById("partyidbtn").addEventListener('click', soAddPartyBtnEvent)
        }
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

    const ownid = await fetch('https://ibgw-manager/getDiscordId').then(res => res.json());
    const ownname = (await fetch(`http://localhost:42069/database/getNameFromDiscord/${ownid}`).then(res => res.json())).name;
    const partyid = await fetch(`http://localhost:42069/discordapi/getParty/${ownname}`).then(res => res.json());

    if (partyBefore === partyid && partyid) {
        openParty(partyid);
    }

    do {
        const ownid = await fetch('https://ibgw-manager/getDiscordId').then(res => res.json());
        const ownname = (await fetch(`http://localhost:42069/database/getNameFromDiscord/${ownid}`).then(res => res.json())).name;
        const partyid = await fetch(`http://localhost:42069/discordapi/getParty/${ownname}`).then(res => res.json());
        if (partyBefore != partyid) {
            // if (!partyid) {
            //     partyMenuOpened = false;
            //     return;
            // };
            if (partyid) {
                openParty(partyid);
                partyBefore = partyid;
            }
        }
        await Delay(1000);
    } while (partyMenuOpened)
}

const onepartytem = document.getElementById("onepartytem");

var singlePartyOpened = false;

async function openParty(partyid) {
    const partycontainer = document.querySelector(".party-container");
    partycontainer.innerHTML = "";
    partycontainer.append(onepartytem.content.cloneNode(true).children[0])

    const party = await fetch(`http://localhost:42069/discordapi/getPartyObject/${partyid}`).then(res => res.json());
    const ownid = await fetch('https://ibgw-manager/getDiscordId').then(res => res.json());

    const unsertollesh2 = partycontainer.querySelector("h2");
    unsertollesh2.innerHTML = `${party.members[0]} (${party.party}) ${unsertollesh2.innerHTML}`;
    // partycontainer.querySelector("h2").append(party.members[0]);

    singlePartyOpened = true;

    document.querySelector(".leavepartysvg").addEventListener('click', () => {
        if (party.owner === ownid) {
            addNotify("Fehler", "Du kannst deine eigene Party nicht verlassen.");
            return;
        }
    })

    document.getElementById("deleteParty").addEventListener('click', async () => {
        await fetch(`http://localhost:42069/discordapi/deleteParty/${partyid}/${ownid}`);
        partyMenuOpened = false;
        await Delay(1500);
        allsocials.innerHTML = "";
        openPartyMenu();
        // allsocials.append(document.getElementById("overlaytem").content.cloneNode(true).children[0]);
        // allsocials.append(partytem.content.cloneNode(true).children[0]);
    })

    const allpartycontent = document.querySelector(".allpartycontent");
    const membertem = document.getElementById("partymembertem");

    var membersbefore = [];

    async function displayAllMembers(members) {
        if (membersbefore == members) return;
        membersbefore = members;
        const div = document.createElement("div");
        div.classList.add("memberliste");
        if (party.owner === ownid) div.classList.add("owner");
        allpartycontent.append(div);
        for (const member of members) {
            const newmeber = membertem.content.cloneNode(true).children[0];
            newmeber.querySelector("h3").innerText = member;
            newmeber.querySelector("img").src = (await fetch(`http://localhost:42069/discordapi/getAvatarURL/${ownid}`).then(res => res.json())).url;
            div.append(newmeber);
        }
    }

    async function displayAllBlocked(blocked) {
        const partyblocked = document.querySelector(".partyblocked");
        partyblocked.innerHTML = "";
        if (blocked.length === 0) {
            partyblocked.append("Keine User geblockt");
        }
        for (const block of blocked) {
            const newmeber = membertem.content.cloneNode(true).children[0];
            newmeber.querySelector("h3").innerText = block;
            newmeber.querySelector("img").src = (await fetch(`http://localhost:42069/discordapi/getAvatarURL/${ownid}`).then(res => res.json())).url;

            newmeber.addEventListener('click', async () => {
                await fetch(`http://localhost:42069/discordapi/unBlockUser/${party.party}/${block}`);
            })

            partyblocked.append(newmeber);
        }
    }

    const settingtem = document.getElementById("partysettingtem");

    const settings = {
        "allowrq": {
            name: "allowrq",
            displayName: "Allow Requests",
        },
        "allowotherinvites": {
            name: "allowotherinvites",
            displayName: "Allow Invites by Others",
        }
    }

    await fetch('https://ibgw-socials/showPartyTags');
    const ids = (await fetch(`http://localhost:42069/database/getIdsFromDiscord/${ownid}`).then(res => res.json())).ids;
    if (party.owner === ownid) {
        await fetch('https://ibgw-socials/warptopartyowner', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(ids)
        })
    }

    do {
        await Delay(1000);
        const neueParty = await fetch(`http://localhost:42069/discordapi/getPartyObject/${party.party}`).then(res => res.json());
        const neueMember = neueParty.members;
        const neueBlocked = neueParty.blocked;
        if (!neueMember) {
            await fetch('https://ibgw-socials/partyDeletePlayerTags', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(party)
            });
            return;
        }
        if (!neueMember.length == party.members.length) {
            party.members = neueMember;
            displayAllMembers(neueMember);
        }
        if (!neueBlocked.length == party.blocked.length) {
            party.blocked = neueBlocked;
            displayAllBlocked(neueBlocked);
        }
        if (partybeforeOBJ == party) continue;
        partybeforeOBJ = party;
        allpartycontent.innerHTML = "";
        displayAllMembers(party.members);
        if (party.owner === ownid) {
            // console.log("owner", party.options);
            allpartycontent.append(document.getElementById("pownertemplate").content.cloneNode(true).children[0]);
            const settingscontainer = document.querySelector(".partysettingsctn");
            displayAllBlocked(party.blocked);
            for (i = 0; i < Object.keys(party.options).length; i++) {
                const value = !Object.values(party.options)[i];
                const name = Object.keys(party.options)[i];

                const settingctn = settingtem.content.cloneNode(true).children[0];

                settingctn.querySelector("p").innerText = settings[name].displayName;
                settingctn.classList.add(name);
                settingctn.querySelector("input").checked = value;
                settingscontainer.append(settingctn);
            }

            const inviteinp = document.getElementById("pownerinviteinput");
            let result;
            let memberInvite;
            inviteinp.addEventListener("change", async () => {
                if (inviteinp.value == null || inviteinp.value.trim().length == 0) return;
                result = await fetch(`http://localhost:42069/database/userExists/${inviteinp.value}`).then(res => res.json());
                if (result == false) {
                    addNotify("Fehler", "Der eingebene Name ist falsch.");
                    return;
                };
                memberInvite = membertem.content.cloneNode(true).children[0];
                memberInvite.querySelector("img").src = "https://cdn.discordapp.com/avatars/859436564047331369/442e94d3631fac40b3c38aa64705243b.png?size=1024";
                memberInvite.querySelector("h3").innerText = inviteinp.value;
    
                memberInvite.addEventListener('click', () => {
                    inviteinp.value = "";
                    memberInvite.remove();
                })
                const partyinvites = document.querySelector(".partyinvites");
                partyinvites.insertBefore(memberInvite, partyinvites.children[1]);
            })

            const pownerinvitebtn = document.getElementById("pownerinvitebtn");
            pownerinvitebtn.addEventListener("click", async () => {
                if (inviteinp.value == null || inviteinp.value.trim().length == 0) return;
                const identifiers = await fetch(`http://localhost:42069/database/getDiscordFromName/${inviteinp.value}`).then(res => res.json());
                inviteinp.value = "";
                memberInvite.remove();
                await fetch(`http://localhost:42069/discordapi/partyinvite/${party.party}/${identifiers.discord}`);
            })

            const pownerblockinput = document.getElementById("pownerblockinput");
            let memberBlock;
            pownerblockinput.addEventListener("change", async () => {
                if (pownerblockinput.value == null || pownerblockinput.value.trim().length == 0) return;
                result = await fetch(`http://localhost:42069/database/userExists/${pownerblockinput.value}`).then(res => res.json());
                if (result == false) {
                    addNotify("Fehler", "Der eingebene Name ist falsch.");
                    return;
                };
                memberBlock = membertem.content.cloneNode(true).children[0];
                memberBlock.querySelector("img").src = "https://cdn.discordapp.com/avatars/859436564047331369/442e94d3631fac40b3c38aa64705243b.png?size=1024";
                memberBlock.querySelector("h3").innerText = pownerblockinput.value;
    
                memberBlock.addEventListener('click', () => {
                    pownerblockinput.value = "";
                    memberBlock.remove();
                })
                const partyblock = document.querySelector(".partyblock");
                partyblock.insertBefore(memberBlock, partyblock.children[1]);
            })

            const pownerblockbtn = document.getElementById("pownerblockbtn");
            pownerblockbtn.addEventListener("click", async () => {
                if (pownerblockinput.value == null || pownerblockinput.value.trim().length == 0) return;
                const name = pownerblockinput.value
                memberBlock.remove();
                pownerblockinput.value = "";
                await fetch(`http://localhost:42069/discordapi/blockUser/${party.party}/${name}`);
            })

            document.querySelectorAll(".partysetting").forEach(setting => {
                setting.addEventListener("click", () => {
                    const checked = setting.querySelector("input").checked;
                    fetch(`http://localhost:42069/discordapi/setSetting`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                        },
                        body: JSON.stringify({
                            setting: {
                                name: setting.classList[1],
                                state: !checked
                            },
                            partyID: party.party
                        })
                    })
                })
            })
        }
    } while (singlePartyOpened)
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

function addNotify(title, text) {
    fetch(`https://ibgw-hud/addNotify`, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            text: text
        })
    })
}

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        fetch('https://ibgw-socials/leavesocials');
        allsocials.style.display = "none";
        friends = [];
        friendsOpened = false;
        partyMenuOpened = false;
        singlePartyOpened = false;

        controller.abort();

        return;
    }
})