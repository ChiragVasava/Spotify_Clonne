let songs; 
let currfolder;
//define currentSong as an Audio object globally before using it
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/songs/${folder}/`);
    let response = await a.text();
    console.log(a)
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div)

    let as = div.getElementsByTagName("a");
    songs = []
    for (const element of as) {
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
            songs = songs.filter((item, idx, arr) => arr.indexOf(item) === idx);
        }
    }

    //Show all the songs in the playlist
    let songOL = document.querySelector(".songList ol");
    songOL.innerHTML = ""; // Clear the existing list

    for (const song of songs) {
        songOL.innerHTML = songOL.innerHTML + `<li>
                        <img class="invert" src="img/music.svg" alt="Music">
                        <div class="info">
                            <div>${decodeURIComponent(song)}</div>
                            <div>Chirag</div>
                        </div>
                        <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="img/play.svg" alt="Play">
                        </div>
                        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    console.log(getSongs)
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/songs/${currfolder}/` + track;
    
    if (!pause) {
        currentSong.play();
        // Fix: Use proper element reference instead of play variable
        document.getElementById("play").src = "img/pause.svg"; // Changed path and element reference
    }
    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    console.log(a)
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);
    for (const e of array) {
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/songs/")[1]?.replace("/", ""); 
            if (!folder) continue;

            try {
                let meta = await fetch(`/songs/${folder}/info.json`);
                let info = await meta.json();

                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card"> 
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141834" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="Cover">
                        <h2>${info.title}</h2>
                        <p>${info.description}</p>
                    </div>`;
            } catch (err) {
                console.error(`Error loading info.json for ${folder}:`, err);
            }
        }
    }

    // Setup click listeners for all generated cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', async () => {
            const folder = card.dataset.folder;
            if (!folder) return alert("No folder set on card");

            try {
                const loadedSongs = await getSongs(folder);
                if (loadedSongs.length === 0) {
                    alert(`No songs in "${folder}"`);
                } else {
                    playMusic(loadedSongs[0]);
                }
            } catch (err) {
                console.error(`Could not load songs from "${folder}":`, err);
            }
        });
    });
}

async function main() {
    // Get the list of all the songs
    await getSongs("Dark");
    playMusic(songs[0], true);

    // Display all the albums on the page
    await displayAlbums();

    // Fix: Use proper element references with getElementById or querySelector
    // Attach an event listener to play button
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "img/pause.svg"; // Fixed path
        }
        else {
            currentSong.pause();
            document.getElementById("play").src = "img/play.svg"; // Fixed path
        }
    });

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

        // Add an Event Listener for bar
        document.querySelector(".bar").style.width = percent + "%";
    })

    // Add an Event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Fix: Add an event listener to previous button with proper element reference
    document.getElementById("previous").addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        
        // Fix: Get current song filename properly
        let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.findIndex(song => decodeURIComponent(song) === currentFile);
        
        if (index > 0) {
            playMusic(songs[index - 1])
        } else if (index === 0) {
            // Optional: Loop to last song
            playMusic(songs[songs.length - 1])
        }
    })

    // Fix: Add an event listener to next button with proper element reference
    document.getElementById("next").addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        // Fix: Get current song filename properly
        let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.findIndex(song => decodeURIComponent(song) === currentFile);
        
        if (index < songs.length - 1 && index !== -1) {
            playMusic(songs[index + 1])
        } else if (index === songs.length - 1) {
            // Optional: Loop to first song
            playMusic(songs[0])
        }
    })

    // Fix: Volume control event listener
    document.querySelector(".range input").addEventListener("input", (e) => {
        console.log(e, e.target, e.target.value)
        let volumeValue = parseInt(e.target.value) / 100;
        currentSong.volume = volumeValue;
        
        // Fix: Auto-update volume icon based on volume level
        let volumeIcon = document.querySelector(".volume>img");
        if (volumeValue === 0) {
            volumeIcon.src = volumeIcon.src.replace("volume.svg", "mute.svg");
        } else {
            volumeIcon.src = volumeIcon.src.replace("mute.svg", "volume.svg");
        }
    })

    // Fix: Add event listener to mute/unmute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        let volumeSlider = document.querySelector(".range input");
        
        if (e.target.src.includes("volume.svg")) {
            // Mute the audio
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            volumeSlider.value = 0;
        } else {
            // Unmute the audio
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.5; // Set to 50% instead of 10%
            volumeSlider.value = 50;
        }
    })
}

// Fix: Remove duplicate main() call and ensure proper initialization
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}