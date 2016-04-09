var audioURL = $(location).attr('host');
console.log(audioURL);
console.log(audioURL+'/firework.mp3');
var playInputStream = document.querySelector('button#play-audio');
var soundSource;
// begin record audio/ record th remote steam below
var recordRTC;

function successCallback(stream) {
    // RecordRTC usage goes here

    var recordRTC = RecordRTC(mediaStream);
    recordRTC.startRecording();
    console.log('started record audio');

}

function errorCallback(error) {
    // maybe another application is using the device
    console.log(error);
}

var mediaConstraints = { video: false, audio: true };
navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
$('#startRecordAudio').click(function (){

});


$('#btnStopRecording').click(function () {
    recordRTC.stopRecording(function(audioURL) {
        audio.src = audioURL;

        var recordedBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function(dataURL) { });
    });

    console.log('stop record');
}) ;


//begin play the local stream as mp3

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();
var gainNode = context.createGain();
gainNode.connect(context.destination);

// don't play for self
gainNode.gain.value = 1;

document.querySelector('input[type=file]').onchange = function() {
    //alert('run to here');
    this.disabled = false;

    var reader = new FileReader();
    reader.onload = (function(e) {
        // Import callback function that provides PCM audio data decoded as an audio buffer
        context.decodeAudioData(e.target.result, function(buffer) {
            // Create the sound source
            var soundSource = context.createBufferSource();

            soundSource.buffer = buffer;
            soundSource.start(0, 0 / 1000);
            soundSource.connect(gainNode);

            var destination = context.createMediaStreamDestination();
            soundSource.connect(destination);

            //playStream();
            createPeerConnection(destination.stream);
        });
    });

    reader.readAsArrayBuffer(this.files[0]);
    console.log('read the as array buffer ok');
};

function createPeerConnection(mp3Stream) {
    // you need to place 3rd party WebRTC code here
    //this solution is add music to the microphone, dont create new stream
}

function HTTP_GET(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();

    xhr.onload = function(e) {
        if (xhr.status != 200) {
            alert("Unexpected status code " + xhr.status + " for " + url);
            return false;
        }

        callback(xhr.response); // return array-buffer
    };
}

// invoke above "HTTP_GET" method
// to load mp3 as array-buffer
function playAudio(){

    HTTP_GET('/firework.mp3', function(array_buffer) {

        // Import callback function that provides PCM audio data decoded as an audio buffer
        context.decodeAudioData(array_buffer, function(buffer) {
            // Create the sound source
            soundSource = context.createBufferSource();

            soundSource.buffer = buffer;
            //PlayInputStream
            console.log(playInputStream.textContent);

            soundSource.start(0, 0 / 1000);
            soundSource.connect(gainNode);

            var destination = context.createMediaStreamDestination();
            soundSource.connect(destination);

            createPeerConnection(destination.stream);
//        soundSource.stop();



        });
    });
}
function stopAudio(){
    soundSource.stop();
    playInputStream.textContent = "PlayInputStream";
}

function playAudioToggle(){
    if (playInputStream.textContent === "PlayInputStream"){
        playInputStream.textContent = "StopInputStream";
        playAudio();
    } else{

        stopAudio();

    }
}