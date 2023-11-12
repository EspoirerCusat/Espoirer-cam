
setTimeout( ()=>{
    if(db){
        //video retrival
        let videoDbTransaction = db.transaction("video","readonly");
        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            //console.log(videoResult);
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj)=>{
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `<div class="media">
                <video autoplay loop src="${url}"></video>
            </div>
            <div class="delete action-btn">DELETE</div>
            <div class="download action-btn">DOWNLOAD</div>`;
            galleryCont.append(mediaElem);
            //Listener 
            let deleteBtn = mediaElem.querySelector(".delete");
            deleteBtn.addEventListener("click",deleteListener);
            let downloadBtn = mediaElem.querySelector(".download");
            downloadBtn.addEventListener("click",downloadListener);
            });
        };
         //image retrival
        let imageDbTransaction = db.transaction("image","readonly");
        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj)=>{
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imageObj.id);
                let url = imageObj.url;
                mediaElem.innerHTML = `<div class="media">
                <img src="${url}"/>
            </div>
            <div class="delete action-btn">DELETE</div>
            <div class="download action-btn">DOWNLOAD</div>`;
            galleryCont.append(mediaElem);
            //Listener 
            let deleteBtn = mediaElem.querySelector(".delete");
            deleteBtn.addEventListener("click",deleteListener);
            let downloadBtn = mediaElem.querySelector(".download");
            downloadBtn.addEventListener("click",downloadListener);
            });

        };

    }
},100);

//UI remove, DB remove
function deleteListener(e){
    //DB remove
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let videoDbTransaction = db.transaction("video","readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        videoStore.delete(id);
    }else if(type === "img"){
        let imageDbTransaction = db.transaction("image","readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        imageStore.delete(id);
    }

    //UI removal 
    e.target.parentElement.remove();
}

function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let videoDbTransaction = db.transaction("video","readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }else if(type === "img"){
        let imageDbTransaction = db.transaction("image","readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
    }
}