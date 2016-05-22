var navigator = window.navigator;
var Context = window.AudioContext || window.webkitAudioContext;
var context = new Context();

// audio
var mediaStream;
var rec;

// video
var videoMediaStream;
var video;

navigator.getUserMedia = (
  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);

function toogleMic() {
  var icon = document.getElementById("record-icon");
  if (icon.classList.contains("recording")) {
    // remove recording icon
    stop();
    icon.classList.remove("recording");
  } 
  else {
    // insert recording icon
    icon.classList.add("recording");
    record();
    
  }


}

function record() {
  navigator.getUserMedia({audio: true}, function(localMediaStream){
    mediaStream = localMediaStream;
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
    rec = new Recorder(mediaStreamSource, {
      workerPath: './lib/js/recorderWorker.js'
    });

    rec.record();
    }, function(err){
      console.log('Not supported');
    });
}

function stop() {
  //mediaStream.stop();

  rec.stop();

  rec.exportWAV(function(e){
    Recorder.forceDownload(e, "test.wav");
    rec.clear();
    
  });
}

function recordVideo() {
  navigator.getUserMedia({video: true, audio: true}, function(localMediaStream){
    videoMediaStream = localMediaStream;
    var Context = window.AudioContext || window.webkitAudioContext;
    var context = new Context();
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);

    video = document.querySelector('video');
    video.src = URL.createObjectURL(localMediaStream);
    video.play();
  }, function(err){
    console.log('Not supported');
  });
}


function stopVideo() {
  video.pause();
  videoMediaStream.stop();
}
