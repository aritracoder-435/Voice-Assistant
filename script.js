let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice"); // FIX: define voice element if it exists

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-IN"; // FIX: valid BCP-47 code (use "hi-IN" for Hindi)
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) { // FIX: include 0
        speak("Good Morning, tell me how can I help you");
    } else if (hours >= 12 && hours < 16) {
        speak("Good afternoon, tell me how can I help you");
    } else if (hours >= 16 && hours < 22) {
        speak("Good evening, tell me how can I help you");
    } else {
        speak("Good night, tell me how can I help you");
    }
}

window.addEventListener('load', () => {
    wishMe();
});

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.lang = "en-IN";           // FIX: set recognition language
recognition.interimResults = false;   // optional, keeps behavior simple
recognition.continuous = false;       // optional, single result per start

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    console.log(event);
    takecommand(transcript.toLowerCase().trim()); // FIX: normalize for matching
};

recognition.onend = () => { // FIX: ensure UI resets even if recognition stops
    if (btn) btn.style.display = "flex";
    if (voice) voice.style.display = "none";
};

document.addEventListener('DOMContentLoaded', function () {
    var element = document.getElementById('btn');
    if (element) {
        element.addEventListener('click', function () {
            recognition.start();
            btn.style.display = "none";
            if (voice) voice.style.display = "block"; // FIX: guard if #voice not present
        });
    }
});

function takecommand(message) {
    if (btn) btn.style.display = "flex";
    if (voice) voice.style.display = "none";

    if (message.includes("hello")) {
        speak("Hello sir, what can I help you?");
    }
    else if (message.includes("what is your name")) { // FIX: removed '?'
        speak("My name is pixel");
    }
    else if (message.includes("who are you")) { // FIX: removed '?'
        speak("I am a virtual assistant, Pixel, created by Aritra Mandal");
    }
    else if (message.includes("open youtube")) {
        speak("Yes, opening YouTube");
        window.open("https://www.youtube.com/", "_blank"); // FIX: open in new tab
    }
    else if (message.includes("thank you")) {
        speak("Most welcome");
    }
    else if (message.includes("open google")) {
        speak("Yes, opening Google");
        window.open("https://www.google.com/", "_blank");
    }
    else if (message.includes("open whatsapp")) {
        speak("Yes, opening WhatsApp");
        // FIX: custom scheme often blocked; web version is reliable on desktop
        window.open("https://web.whatsapp.com/", "_blank");
    }
    // // If you want Spotify later, the condition must check each includes:
    // else if (message.includes("open spotify") || message.includes("play music") || message.includes("play song")) {
    //     speak("Yes, opening Spotify");
    //     window.open("https://open.spotify.com/", "_blank");
    // }
    else {
        speak(`Here is what I found on the internet regarding ${message}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank"); // FIX: encode query
    }
}
