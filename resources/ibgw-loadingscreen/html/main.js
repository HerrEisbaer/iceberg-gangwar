const video = document.querySelector("video");
video.currentTime = 30;

const audio = document.querySelector("audio");
audio.currentTime = 30;

video.onended = () => {
    video.src = "http://localhost:42069/loadingscreen/interworldjdm.mp4";
    audio.src = "http://localhost:42069/loadingscreen/interworldjdm.mp3"
    fade(video)
}
audio.volume = 0.5

const volume = document.querySelector(".volume");

const volumeslider = volume.querySelector("input");

var muted = false;
var vormute = .5;

const volumeimg = volume.querySelector("img");

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key === " ") {
        muted = !muted;
        if (muted) {
            volumeimg.src = "html/img/muted.png"
            vormute = audio.volume;
            audio.volume = 0;
            volumeslider.value = 0;
        } else {
            volumeimg.src = "html/img/sound.png"
            audio.volume = vormute;
            volumeslider.value = vormute * 100;
        }
    }
})

volumeimg.addEventListener('click', (e) => {
    muted = !muted;
    if (muted) {
        volumeimg.src = "html/img/muted.png"
        vormute = audio.volume;
        audio.volume = 0;
        volumeslider.value = 0;
    } else {
        volumeimg.src = "html/img/sound.png"
        audio.volume = vormute;
        volumeslider.value = vormute * 100;
    }
})

volumeslider.addEventListener('input', () => {
    volumeimg.src = "html/img/sound.png";
    muted = false;
    audio.volume = volumeslider.value / 100;
})

const uhrzeith2 = document.getElementById("uhrzeith2");

const tage = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

setInterval(() => {
    const date = new Date();
    uhrzeith2.innerText = `${tage[date.getDay()]}, ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())} Uhr`
}, 1000);

const user = document.querySelector(".user");
// const discordid = window.nuiHandoverData.identifiers[2].split(":")[1];

const news = document.querySelector(".news");

const newstem = document.getElementById("newstem");
const newsctn = document.querySelector(".newsctn");

start()

async function start() {
    // const username = await fetch(`http://localhost:42069/database/getNameFromDiscord/${discordid}`).then(res => res.json());
    
    // const bannerurl = await fetch(`http://localhost:42069/discordapi/getBannerURL/${discordid}`).then(res => res.json());
    // if (bannerurl) document.querySelector(".ibgw").style.backgroundImage = `url('${bannerurl}')`;
    
    // const img = document.createElement("img");
    // img.width = "40px";
    // img.height = "40px";
    // const pfp = (await fetch(`http://localhost:42069/getAvatarURL/getBannerURL/${discordid}`).then(res => res.json())).url
    // user.innerText = username || window.nuiHandoverData.name;
    // if (pfp) {
    //     img.src = pfp
    //     user.prepend(img)
    // };
    
    // const allnews = [
    //     {
    //         "title": "Geiles SexRP oh ja",
    //         "date": "08.04.2023, 20:16",
    //         "link": "https://discord.com/channels/1043448053530636308/1068921596271669369/1094324902812725248",
    //         "image": "https://cdn.discordapp.com/embed/avatars/2.png"
    //     }
    // ]
    const allnews = await fetch("http://localhost:42069/discordapi/getnews/3").then(res => res.json());

    if (allnews.message || !allnews || allnews.length === 0) {
        news.querySelector("h2").innerText = "Keine neuen News";
        return;
    };

    for (singlenews of allnews) {
        const newnews = newstem.content.cloneNode(true).children[0];
        newnews.querySelector("h3").innerText = singlenews.title;
        newnews.querySelector("p").innerText = singlenews.date;
        newnews.href = singlenews.link;
        newsctn.append(newnews);
    }
}

function addZero(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num.toString();
    }
}

function fade(element) {
    var op = 0;
    var timer = setInterval(() => {
        if (op >= 1) clearInterval(timer);
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1 || 0.1;
    }, 50);
}