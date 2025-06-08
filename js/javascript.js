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

        // audio.addEventListener("loadedata", () => {
        // console.log(audio.duration, audio.currentSrc, audio.currentTime)
        // The duration variable now holds the duration (in seconds) of the audio clip
        // });
}
main()
