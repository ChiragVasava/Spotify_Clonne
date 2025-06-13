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
    currfolder = `songs/${folder}`;
    let a = await fetch(`${currfolder}/`);
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = []
    for (const element of as) {
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currfolder}/`)[1]);
        }
    }

    //Show all the songs in the playlist
    let songOL = document.querySelector(".songList ol");
    songOL.innerHTML = ""; // Clear the existing list

    for (const song of songs) {
        songOL.innerHTML = songOL.innerHTML + `<li>
                        <img class="invert" src="img/music.svg" alt="Music">
                        <div class="info">
                            <div> ${song.replaceAll("%20", "")}</div>
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

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track;
    // currentSong.play()
    // By Default Shows Pause Button When Loads
    if (!pause) {
        // currentSong.play()
        play.src = "/img/play.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (const e of array) {

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `   <div data-folder="${folder}" class="card"> 
            <div class="play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141834" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                            </svg>
                        </div>
                        
                        <img src="/songs/${folder}/cover.jpg" alt="Cover">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    // Load the Playlist Whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(item.currentTarget.dataset.folder); // dataset.folder should be just "English", "Hindi", etc.
            playMusic(songs[0], true);
        });
    });
}

async function main() {
    //Get the list of all the songs
    await getSongs("songs/English");
    playMusic(songs[0], true)

    // To get List of Songs
    // console.log(songs)

// Display all the albums on the page
    displayAlbums()

    //Play The First Song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/img/play.svg"
        }
    });


    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)}/
        ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    //The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

        // Add an Event Lisntner for bar
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

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
 
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let songFileNames = songs.map(songUrl =>
  decodeURIComponent(songUrl.split("/").pop())
);


    let index = songFileNames.indexOf(currentFile);

    if (index < songs.length - 1) {
        // let nextSongUrl = songs[index + 1];
        let nextSongName = decodeURIComponent(songs[index + 1].split("/").pop());
        playMusic(nextSongName);
    }


// Use this function Add an event to Volume Without using input class in Volume HTML
document.querySelector(".range input").addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value)
    currentSong.volume = parseInt(e.target.value) / 100
})

// Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
}
main();
