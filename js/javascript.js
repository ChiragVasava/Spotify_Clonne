console.log("Lets Write Javascript");

async function getSongs() {

    let a = await fetch("http://192.168.29.83:3000/songs/English/")
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
    console.log(songs)

    //Play The First Song
    var audio = new Audio(songs[0]);
    audio.play();

}
main()
