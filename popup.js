// devolped by mohaned ashraf ElHaddad as cs50 final project 2@17//
// open source project you can re use it //

function main(){

window.scrollTo(0,0)
var currentPage;
var secondpage;
var testpage;
var x;
//request first function
query();



//fuction 1 get url 
function query(){
  console.log();
    chrome.tabs.query({ audible: true}, function(tabs){
      // store url on load first time
       currentPage =tabs[0].url;
          //get youtube id
          var id = linkifyYouTubeURLs(tabs[0].url);
          //send id to function no.2
          YoutubeName(id);
          
    })
}




// Linkify youtube URLs which are not already links.
function linkifyYouTubeURLs(url) {
    var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    return url.replace(re,'$1');
}







//get name from id (2)
function YoutubeName(id) {

        var xhr =new XMLHttpRequest();
        xhr.open('GET','https://www.googleapis.com/youtube/v3/videos?id='+id+'&key=AIzaSyAAoVgWMlMiuoyhU2xAkMJ9YAPthUsGXAA&fields=items(snippet(title))&part=snippet',true);

         xhr.onload = function () {

            if(this.status==200){
                var youtube_name =JSON.parse(this.responseText);
                 test=youtube_name.items[0].snippet.title;
                console.log(test);
                //send name of youtube video  to function 3 
                 SongName(test);
                }
            }//END
            xhr.send();

      }



//get artistName and songname (3)
function SongName(youtubeName){
              var alltomp3 ='https://api.alltomp3.org/v1/guess-track/'+youtubeName;
          var xhr =new XMLHttpRequest();
          xhr.open('GET',alltomp3,true);

          xhr.onload = function () {
              if(this.status==200){
                  var song_name =JSON.parse(this.responseText);
                  test1=song_name.artistName; 
                  test2=song_name.title;
                  //console.log(test1);
                  //get lyrics
                  SongLyric(test1,test2);
                  }
              }
              xhr.send();
}
var x=0;
function query2(){
                chrome.tabs.query({ audible: true}, function(tabs){
                //   //store url of second song
                secondpage =tabs[0].url;

                if (x==0 || currentPage != secondpage) 
                {                    
                   setTimeout(function(){var x =setInterval(function(){
                  if (currentPage != secondpage)
                   {
                    clearInterval(x);
                   }
                   else
                    {
                      scrollBy(0,1);
                    }
                   },125)},47000);
                }
                x=x+1;
                

                if (currentPage != secondpage){ 

                  //stop setInterval untill we get next song lyrics
                  clearInterval(refreshIntervalId);
                  main();
                  }
                  })
                    
                }
                //end of query2


function download(filename, text) {
  console.log(text);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


//get lyrics (4)
function SongLyric(artist,song){
              var lyriclink ='https://api.lyrics.ovh/v1/'+artist+'/'+song;
          var xhr =new XMLHttpRequest();
          xhr.open('GET',lyriclink,true);

          xhr.onload = function () {
              if(this.status==200){

                  console.log(this.responseText);
                  //remove lines 
                  // lyrics_without_lines = .replace("\n\n", '\n');

                 // console.log("Paroles de la chanson " + song+ "par " +artist);
                  

                  var song_lyric =JSON.parse(this.responseText);
                  console.log(song_lyric.lyrics);
                  song_lyric.lyrics = song_lyric.lyrics.replace('\r\n\r\n', '\n'); // Just one new line

                  
                  document.getElementById('status').innerHTML = '<div class="container">' + song_lyric.lyrics  + '</div><br><br><input type="button" style="margin-left:2%;" id="dwn-btn1" class="btn btn-primary" value="Download" <br> <input type="button" style="margin-left:2%;" id="dwn-btn2" class="btn btn-primary" value="Copy" <br><br> <br>';
                  // // Generate download of hello.txt file with some content
                  document.getElementById("dwn-btn1").addEventListener("click", function(){

                  var text = song_lyric.lyrics;
                  var filename = song;
                  
                  download(filename, text);

                   }, false);



                  document.getElementById("dwn-btn2").addEventListener("click", function(){

                  function copyToClipboard(text) {
                      window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
                    }
                  var text = song_lyric.lyrics;

                  copyToClipboard(text);


                  }, false);
                  //document.getElementById('loader').style.display = 'none';


}
                      else if(this.status ==404){
          document.getElementById('status').innerHTML = '<div class ="container" ><div class="row"><div class="col-md-12"><div class="error-template"><h1>Oops!</h1><h2>Song not found</h2><div class="error-details">Sorry, We did not find lyrics for this song!</div><div class="error-actions"><a href="http://www.jquery2dotnet.com" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-home"></span>Take Me Home </a><a href="http://www.jquery2dotnet.com" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-envelope"></span> Contact Support </a></div></div></div></div></div><br><style type="text/css">body { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKqq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABHklEQVRIib2Vyw6EIAxFW5idr///Qx9sfG3pLEyJ3tAwi5EmBqRo7vHawiEEERHS6x7MTMxMVv6+z3tPMUYSkfTM/R0fEaG2bbMv+Gc4nZzn+dN4HAcREa3r+hi3bcuu68jLskhVIlW073tWaYlQ9+F9IpqmSfq+fwskhdO/AwmUTJXrOuaRQNeRkOd5lq7rXmS5InmERKoER/QMvUAPlZDHcZRhGN4CSeGY+aHMqgcks5RrHv/eeh455x5KrMq2yHQdibDO6ncG/KZWL7M8xDyS1/MIO0NJqdULLS81X6/X6aR0nqBSJcPeZnlZrzN477NKURn2Nus8sjzmEII0TfMiyxUuxphVWjpJkbx0btUnshRihVv70Bv8ItXq6Asoi/ZiCbU6YgAAAABJRU5ErkJggg==);}.error-template {padding: 40px 15px;text-align: center;}.error-actions {margin-top:15px;margin-bottom:15px;}.error-actions .btn { margin-right:10px; }</style>';
              }


              }

               
              xhr.send();


              
}
//check if song changed 


var refreshIntervalId= setInterval(query2, 500);






}

  main();
