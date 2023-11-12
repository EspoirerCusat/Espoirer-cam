//1. Open a database
//2. Create ObjectStore
//3. Make transactions

let db;

let openRequest = indexedDB.open("myDataBase");

openRequest.addEventListener("success",(e)=>{
    console.log("db success");
    db = openRequest.result;
});

openRequest.addEventListener("error",(e)=>{
    console.log("db error");
});

openRequest.addEventListener("upgradeneeded",(e)=>{
    console.log("db upgraded and also for initial DB creation");
    db = openRequest.result;

    db.createObjectStore("video",{keyPath:"id"});
    db.createObjectStore("image",{keyPath:"id"});
});