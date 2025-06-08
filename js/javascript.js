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

async function main() {
    //Get the list of all the songs
    let songs = await getSongs()
    // console.log(songs)

        //Show all the songs in the playlist
    let songUL = document.querySelector(".songList ol");
    // songUL.innerHTML = ""
    for (const song of songs) {
let fileName = decodeURIComponent(song.split("/").pop());
    songUL.innerHTML += `<li>${fileName}</li>`;
    }

    //Play The First Song
    // var audio = new Audio(songs[0]);
    // audio.play();

        audio.addEventListener("loadedata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
        // The duration variable now holds the duration (in seconds) of the audio clip
    });
}
main()
