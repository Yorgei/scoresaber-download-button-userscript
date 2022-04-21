// ==UserScript==
// @name         ScoreSaber Download Buttons
// @namespace    https://www.youtube.com/watch?v=_kuiQOowPHg
// @downloadURL  https://raw.githubusercontent.com/Yorgei/scoresaber-download-button-userscript/main/downloadbuttons.user.js
// @version      1.0.2
// @description  i really dislike javascript
// @author       Yorgei
// @match        *://scoresaber.com/*
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
    setInterval(function () {
        let scoreSaberList = window.location.pathname.split('/');
        if (!scoreSaberList.includes('leaderboard')) {
            return;
        }
        if (document.querySelector('#epic-buttons') !== null){
            return;
        }
        let scoreSaberId = scoreSaberList.pop();
        if (scoreSaberId == null) {
            return;
        }
        console.log(`loaded on id ${scoreSaberId}`);
        var isInjected = false;

        if (isInjected) {
            console.log('already injected');
            return;
        }
        console.log('checking');
        // setTimeout(() => { console.log('waiting for load'); }, 2000);
        if(document.querySelectorAll('.window.card-content') !== null) {
            const songHashText = document.querySelector('.text-muted')
            if (!songHashText) {
                return;
            }
            const songHash = songHashText.innerText;
            getChartData(songHash).then(function(res) {
                if (res.error) {
                    let errorDiv = document.createElement('div');
                    let songDiv = document.querySelector('.card-content');
                    errorDiv.innerHTML = '<div id=epic-buttons>Song not found</div>';
                    songDiv.appendChild(errorDiv);
                    return;
                }
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
                if (document.querySelector('#epic-buttons') == null) {
                    songDiv.appendChild(buttonContainer);
                    let twitchButton = document.getElementsByClassName('song-request')[0];
                    twitchButton.addEventListener('click', () => {
                        navigator.clipboard.writeText(twitchSongRequest);
                        console.log('yeeaeeaa');
                    })
                }

            })

            isInjected = true;
        }
    }, 1000)
}

})();