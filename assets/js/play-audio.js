var audio_context;
var recorder;

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  //__log('Media stream created.');

  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');
  
  recorder = new Recorder(input);
  //__log('Recorder initialised.');
}

function startRecording(button) {  
  //document.getElementById('btnPlay').innerHTML  = "Gravando...";
  recorder && recorder.record();
  button.disabled = true;  
  button.nextElementSibling.disabled = false;
  //__log('Recording...');
}

function stopRecording(button) {  
  recorder && recorder.stop();
  button.disabled = true;
  button.previousElementSibling.disabled = false;  
  //__log('Stopped recording.');
  
  // create WAV download link using audio data blob
  createDownloadLink();
  
  recorder.clear();
}

function createDownloadLink() {    
  recorder && recorder.exportWAV(function(blob) {
    var recordingslist = document.getElementById('recordingslist');
    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');     
    var span = document.createElement('span');   
    //hf.setAttribute("class", "btn btn-success");  
    li.setAttribute("class", "list-group-item");
    span.setAttribute("class", "badge");
    
    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download =  new Date().toISOString() + '.wav';
    hf.innerHTML = '<span class="glyphicon glyphicon-download-alt">Download</span>';
    span.appendChild(hf);
    li.appendChild(span);    
    li.appendChild(au);    
    recordingslist.appendChild(li);
  });
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    
    audio_context = new AudioContext;
    //__log('Audio context set up.');
    //__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
  } catch (e) {
    alert('No web audio support in this browser!');
  }
  
  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    //__log('No live audio input: ' + e);
  });
};