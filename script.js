
let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtncont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let recordFlag = false;

let transparentColor = "transparent";

let recorder;
let chunks = []; //media data in chunks

let contraints = {
    video: true,
    audio: true
}

//navigator -> global, browser info

navigator.mediaDevices.getUserMedia(contraints)
.then((stream)=>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks = [];
        startTimer();
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        //convertion of data to video
        let blob = new Blob(chunks,{type : "video/mp4"});
        let videoUrl = URL.createObjectURL(blob);

        if(db){
            let videoID = `vid-${shortid()}`;
            let dbTransaction = db.transaction("video","readwrite"); //request
            let videoStorage = dbTransaction.objectStore("video");
            let videoEntry = {
                id : videoID,
                blobData : blob
            };
            videoStorage.add(videoEntry);
            
        }
        // let a = document.createElement("a");
        // a.href = videoUrl;
        // a.download = "stream.mp4";
        // a.click();
    })
})


recordBtnCont.addEventListener("click",(e)=>{
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag){ //start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }else{ //end
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }

});

captureBtncont.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");
    //if(!recorder) return;
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    //filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL = canvas.toDataURL();
    if(db){
        let imageID = `img-${shortid()}`;
        let dbTransaction = db.transaction("image","readwrite");
        let imageStorage = dbTransaction.objectStore("image");
        let imageEntry = {
            id : imageID,
            url : imageURL
        }
        imageStorage.add(imageEntry);
    }

    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500);

    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();
})

let timerID;
let counter = 0; //Represents total seconds;
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600; //remaining value
        let minutes = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds % 60; //remaining value;
        let seconds = totalSeconds;
        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }
    timerID = setInterval(displayTimer,1000);
}

function stopTimer(){
    timer.style.display = "none";
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}

//Filter logic 
let filterlayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //Get
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterlayer.style.backgroundColor = transparentColor;
    })
})