const {ipcRenderer} = require('electron')
const StatArray=["red","yellow","green"];
let shouldStart = true;

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send("CheckSql");
    ipcRenderer.send("CheckSocket");
    ipcRenderer.send("CheckTwitch");
    ipcRenderer.send("CheckClients");
})
ipcRenderer.on("SqlStatus",(e, status) =>{
    document.querySelector("#SQL_Server_Status").classList.remove("red");
    document.querySelector("#SQL_Server_Status").classList.remove("yellow");
    document.querySelector("#SQL_Server_Status").classList.remove("green");
    document.querySelector("#SQL_Server_Status").classList.add(StatArray[status]);
});
ipcRenderer.on("MainServerStatus", (e, status) =>{

})
document.querySelector('.StartServer').addEventListener('click',() => {
    shouldStart ? ipcRenderer.send("StartGame") : ipcRenderer.send("StopGame");
    document.querySelector('.StartServer').classList.toggle("green");
    document.querySelector('.StartServer').innerHTML = shouldStart ? "Start Server" : "Stop Server";
    shouldStart = !shouldStart;
});