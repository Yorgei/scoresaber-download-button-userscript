// ==UserScript==
// @name         ScoreSaber Download Buttons
// @namespace    https://www.youtube.com/watch?v=_kuiQOowPHg
// @downloadURL  https://raw.githubusercontent.com/Yorgei/scoresaber-download-button-userscript/main/main.js
// @version      1.0.1
// @description  i really dislike javascript
// @author       Yorgei
// @match        *scoresaber.com/leaderboard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scoresaber.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', load);

function getChartData(songHash) {
    const beatsaverAPIURL = `https://api.beatsaver.com/maps/hash/${songHash}`;
    return fetch(beatsaverAPIURL).then(response => {return response.json()})
}

function load() {
    const scoreSaberId = window.location.pathname.split('/').pop();
    if (scoreSaberId == null) {
        return;
    }
    console.log(`loaded on id ${scoreSaberId}`);
    var isInjected = false;
    setInterval(function () {
        if (isInjected) {
            return;
        }
        console.log('checking');
        if(document.querySelector('.content') !== null) {
            console.log(document.querySelector('.text-muted').innerText);
            const songHash = document.querySelector('.text-muted').innerText;
            getChartData(songHash).then(function(res) {
                const songId = res.id;
                const beatsaverDownloadURL = `https://as.csn.beatsaver.com/${songHash}.zip`;
                const beatsaverSongURL = `https://beatsaver.com/maps/${songHash}`;
                const oneClickURL = `beatsaver://${songId}`;
                const twitchSongRequest = `!bsr ${songId}`;
                console.log(oneClickURL);
                let buttonContainer = document.createElement('div');
                buttonContainer.innerHTML = `
                <style>
                    #epic-buttons {
                        display: flex;
                        justify-content: center;
                    }
                    #epic-buttons > div {
                        cursor: pointer;
                        margin: 0.5em;
                        border-radius: 5px;
                        text-align: center;
                        color: #72a8ff;
                        transition: all 0.2s ease-in-out;
                    }
                    #epic-buttons > div:hover {
                        color: #ffde1a;
                        transition: all 0.2s ease-in-out;
                    }

                </style>
                <div id="epic-buttons">
                <div class="oc" title="OneClick Install"><a href=${oneClickURL}><i class="fas fa-cloud-download-alt"></i></a></div>
                <div class="bs" title="Open Beatsaver"><a href=${beatsaverSongURL}><i class="fas fa-book-open"></i></a></div>
                <div class="bsd" title="Direct Download"><a href=${beatsaverDownloadURL}><i class="fas fa-download"></i></a></div>
                <div class="song-request" title="Copy !bsr request"><i class="fab fa-twitch"></i></div>
                </div>`
                let songDiv = document.querySelector('.card-content');
                if (document.querySelector('#epic-buttons') !== null) {
                    return;
                }
                songDiv.appendChild(buttonContainer);
                let twitchButton = document.getElementsByClassName('song-request')[0];
                twitchButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(twitchSongRequest);
                    console.log('yeeaeeaa');
                })
            })

            isInjected = true;
        }
    }, 1000)
}

})();