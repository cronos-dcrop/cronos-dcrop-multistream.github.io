function sendDataTroughDatachannel(data) {
    if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(data);
    }
}

function exposureUp() {
    console.log("exposureUp");
    sendDataTroughDatachannel("requestAction=exposureUp");
}

function exposureDown() {
    console.log("exposureDown");
    sendDataTroughDatachannel("requestAction=exposureDown");
}

function brightnessUp() {
    console.log("brightnessUp");
    sendDataTroughDatachannel("requestAction=brightnessUp");
}

function brightnessDown() {
    console.log("brightnessDown");
    sendDataTroughDatachannel("requestAction=brightnessDown");
}

function contrastUp() {
    console.log("contrastUp");
    sendDataTroughDatachannel("requestAction=contrastUp");
}

function contrastDown() {
    console.log("contrastDown");
    sendDataTroughDatachannel("requestAction=contrastDown");
}

function switchAdjustmentsMenu(){
    let popup = document.getElementById("cameraAdjustmentsMenu");
    if(popup.style.display === "block"){
        popup.style.display = "";
    }else{
        popup.style.display = "block";
    }
}