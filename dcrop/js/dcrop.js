let isControlActive = false;
// let connected = false;
let isStarted = false;
let remoteVideo = null;
let recvonly;

const debug = false;
const options = {
  multistream: true
}
const metadata = {
  'signaling_key': signalingKey,
};

// channelIdからカメラ名生成
document.querySelector("#channelIdInput").value = channelId;
let lblCameraName = document.getElementById("cameraName");
let cameraName = channelId;
cameraName = cameraName.replace("cronos-dcrop@", "");
lblCameraName.innerHTML = cameraName;
logger.logServerId = cameraName;

// 接続スタート
const startConnection = async () => {
  sora = Sora.connection(signalingUrl, debug);
  recvonly = sora.recvonly(channelId, metadata, options);

  // 接続
  recvonly
    .connect()
    .then((stream) => {
      console.log("fromIframe >> channelId = " + channelId);
      // ここがうまくいかない
      if (remoteVideo == null || remoteVideo.srcObject == null) {
      }
      else {
        console.log("connect");
        var restartStreamButton = document.getElementById("restartStreamButton");
        restartStreamButton.style.visibility = "hidden";
      }
    })
    .catch((e) => {
      console.error(e);
  });

  // MediaStream追加
  recvonly.on('track', function(event) {
    const stream = event.streams[0];
    if (!stream) {
      return;
    }

    const remoteVideoId = 'remotevideo-' + stream.id;
    const videoContainer = document.querySelector('#videoContainer');
    if (!videoContainer.querySelector('#' + remoteVideoId)) {
      const video = document.createElement('video');
      video.id = remoteVideoId;
      video.autoplay = true;
      video.muted = true;
      video.style.objectFit = "cover";
      video.srcObject = stream;
      video.onmouseleave = function () {
        hideControls();
      }
      video.onmousemove = function () {
        showControls();
        setTimeout(function(){
          if (!isControlActive) {
            hideControls();
          }
        }, 3000);
      }

      videoContainer.appendChild(video);
      remoteVideo = document.querySelector('#' + remoteVideoId);
    }
  });

  // MediaStream削除
  recvonly.on('removetrack', function(event) {
    const video = document.querySelector('#remotevideo-' + event.target.id);
    if (video) {
      document.querySelector('#videoContainer').removeChild(video);
      remoteVideo = null;
    }
  });

  // 切断
  recvonly.on('disconnect', function(event) {
    console.log(event);
    window.location.reload(1);
  });
};

// ページ再読込み
const reload = () => {
  if (recvonly) {
    recvonly.disconnect();
  }
  console.log("ページ再読込");
}

// ページ読込み完了時
window.onload = function () {
  startConnection();
  start();
}

// スリープ
const sleep = ms => new Promise(resolve =>
  setTimeout(resolve, ms)
);

// スタート
const start = async () => {
  if (!isStarted) {
    doWorkAsync();
  }
  isStarted = true;
}

// 非同期動作
async function doWorkAsync() {
  var restartStreamButton = document.getElementById("restartStreamButton");
  restartStreamButton.style.visibility = "visible";
  while (true) {
    await sleep(2000);
    // if (!connected) {
    //   console.log("retrying to connect");
    //   window.location.reload(1);
    // }
    if (remoteVideo == null || remoteVideo.srcObject == null) {
      console.log("retrying to connect");
      window.location.reload(1);
    }
  }
}

// フルスクリーンチェンジイベント
document.addEventListener("fullscreenchange", ()=> {
  fullScreenChange();
});
document.addEventListener("webkitfullscreenchange", ()=> {
  fullScreenChange();
});
document.addEventListener("mozfullscreenchange", ()=> {
  fullScreenChange();
});
document.addEventListener("MSFullscreenChange", ()=> {
  fullScreenChange();
});

// controlクラスにonMouseOver、onMouseOutイベントを追加
controls = document.getElementsByClassName("control");
for (var i = 0; i < controls.length; i++) {
  control = controls[i];
  control.onmouseover = function () {
    showControls();
    isControlActive = true;
  }
  control.onmouseout = function () {
    isControlActive = false;
  }
}

// コントロール表示
function showControls() {
  let controls = document.getElementsByClassName("control");
  for (var i = 0; i < controls.length; i++) {
    let control = controls[i];
    control.style.visibility = "visible";
  }

  // フルスクリーンの場合
  if (isFullScreen()) {
    document.getElementById("fullScreenControl").style.visibility = "hidden";
    document.getElementById("exitFullScreenControl").style.visibility = "visible";
  }
  else {
    document.getElementById("fullScreenControl").style.visibility = "visible";
    document.getElementById("exitFullScreenControl").style.visibility = "hidden";
  }
}

// コントロール非表示
function hideControls() {
  let controls = document.getElementsByClassName("control");
  for (var i = 0; i < controls.length; i++) {
    let control = controls[i];
    control.style.visibility = "hidden";
  }
  let popup = document.getElementById("cameraAdjustmentsMenu");
  popup.style.display = "";
}

// アスペクト
function switchAspect() {
  if (remoteVideo != null) {
    let icon = document.getElementById("aspectControl");
    if (remoteVideo.style.objectFit == "cover") {
      remoteVideo.style.objectFit = "unset";
      icon.innerHTML = '<i class="fas fa-expand noselect"></i>';
      console.log("aspect expand");
    } else {
      remoteVideo.style.objectFit = "cover";
      icon.innerHTML = '<i class="fas fa-compress noselect"></i>';
      console.log("aspect compress");
    }
  }
}

// 音声
function muteUnmute() {
  if (remoteVideo != null) {
    let icon = document.getElementById("speakerControl");
    if (remoteVideo.muted === false) {
      remoteVideo.muted = true;
      icon.innerHTML = '<i class="fas fa-volume-mute noselect"></i>';
      console.log("volume mute");
    } else {
      remoteVideo.muted = false;
      icon.innerHTML = '<i class="fas fa-volume-up noselect"></i>';
      console.log("volume up");
    }
  }
}

// フルスクリーン表示
function fullScreen() {
  // Chrome & Firefox v64以降
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  // Firefox v63以前
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  // Safari & Edge & Chrome v68以前
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  // IE11
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

// フルスクリーン解除
function exitFullScreen() {
  fullScreen();

  // Chrome & Firefox v64以降
  if (document.exitFullscreen) {
    document.exitFullscreen();
  // Firefox v63以前
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  // Safari & Edge & Chrome v44以前
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  // IE11
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// フルスクリーンチェンジ
function fullScreenChange() {
  var mode = window.parent.document.getElementById("videoMode");
  var name = window.parent.document.getElementById("fullCameraName");
  if( window.document.fullscreenElement ){
    mode.value = "1";
    name.value = channelId;
    console.log("フルスクリーン表示");
  }
  else{
    mode.value = "0";
    name.value = "";
    console.log("フルスクリーン解除");
  }
}

// フルスクリーンチェック
function isFullScreen() {
  var mode = window.parent.document.getElementById("videoMode");
  var name = window.parent.document.getElementById("fullCameraName");
  if (mode.value == "1" && name.value == channelId) {
    return true;
  }
  else {
    return false;
  }
}