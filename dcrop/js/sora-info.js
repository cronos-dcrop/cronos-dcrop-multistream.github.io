const signalingUrl = 'wss://sora-labo.shiguredo.jp/signaling';
let channelId = 'cronos-dcrop@sora-labo-sample';
let signalingKey = null;

// query string から roomId, clientId を取得するヘルパー
function parseQueryString() {
  const qs = window.Qs;
  if (window.location.search.length > 0) {
    var params = qs.parse(window.location.search.substr(1));
    if (params.channelId) {
      channelId = params.channelId;
    }
    if (params.signalingKey) {
      signalingKey = params.signalingKey;
    }
  }
}

parseQueryString();