let dcropController = {};

//AWS
//dcropController.controlUrl = "http://3.112.48.95:8080/execute?";
//AWS API
dcropController.controlUrl = "https://tv8b1fx3q2.execute-api.ap-northeast-1.amazonaws.com/execute?";
//LOCAL
//dcropController.controlUrl = "http://localhost:8080/execute?";

dcropController.makeRequest = function (method, url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
                console.log("makeRequest() >> load resolve");
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
                console.log("makeRequest() >> load reject");
            }
        };
        xhr.onerror = function (error) {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
            console.error(`makeRequest() >> ${error.type} status:${this.status} statusText:${xhr.statusText}`);
        };
        if (method == "POST" && data) {
            xhr.send(data);
            console.log("makeRequest() >> POST");
        } else {
            xhr.send();
            console.log("makeRequest()");
        }
    });
}

dcropController.restartStream = function (dcropid) {
    if(dcropid){
        dcropid = String(dcropid).replace('cronos-dcrop@','');
    }
    var cmd = `${dcropController.controlUrl}command=restartStream&dcropid=${dcropid}`;
    console.log(`リスタートストリームします。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('POST', cmd, {});
}