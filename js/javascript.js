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

async function getSongs() {

    let a = await fetch("songs/English")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs
}

//define currentSong as an Audio object globally before using it
let currentSong = new Audio();

const playMusic = (track) => {
    // let audio = new Audio("/songs/English/" + track)
    currentSong.src = "/songs/English/" + track
    currentSong.play()
    // By Default Shows Pause Button When Loads
    play.src = "/img/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    //Get the list of all the songs
    let songs = await getSongs()
    // console.log(songs)

        //Show all the songs in the playlist
    let songUL = document.querySelector(".songList ol");
    // songUL.innerHTML = ""
    for (const song of songs) {
let fileName = decodeURIComponent(song.split("/").pop());
    songUL.innerHTML += `<li>
                        <img class="invert" src="img/music.svg" alt="Music">
                        <div class="info">
                            <div>${fileName}</div>
                            <div>Chirag</div>
                        </div>
                        <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="img/play.svg" alt="Play">
                        </div>
                        </li>`;
    }

    // Load the first song in the playlist automatically (without playing)
if (songs.length > 0) {
    // Get the first song name
    let firstSongName = decodeURIComponent(songs[0].split("/").pop());

    // Load it into the player without playing
    currentSong.src = "/songs/English/" + firstSongName;

    // Update the UI (song info and reset time)
    document.querySelector(".songinfo").innerHTML = firstSongName;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

    
    //Play The First Song
    // var audio = new Audio(songs[0]);
    // audio.play();

        // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

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
    })

        //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
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
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    }) 

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

// Add an event listener to previous
previous.addEventListener("click", () => {
    console.log("Previous clicked");

    // Get current filename only (last part after /)
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());

    // Get filenames from songs array
    let songFileNames = songs.map(songUrl => decodeURIComponent(songUrl.split("/").pop()));

    let index = songFileNames.indexOf(currentFile);

    if (index > 0) {
        let prevSongUrl = songs[index - 1];
        let prevSongName = decodeURIComponent(prevSongUrl.split("/").pop());
        playMusic(prevSongName);
    }
});

// Add an event listener to next
next.addEventListener("click", () => {
    console.log("Next clicked");

    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let songFileNames = songs.map(songUrl => decodeURIComponent(songUrl.split("/").pop()));

    let index = songFileNames.indexOf(currentFile);

    if (index < songFileNames.length - 1) {
        let nextSongUrl = songs[index + 1];
        let nextSongName = decodeURIComponent(nextSongUrl.split("/").pop());
        playMusic(nextSongName);
    }
});

        // audio.addEventListener("loadedata", () => {
        // console.log(audio.duration, audio.currentSrc, audio.currentTime)
        // The duration variable now holds the duration (in seconds) of the audio clip
        // });
}
main()
