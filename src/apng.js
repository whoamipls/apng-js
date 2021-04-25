import parseAPNG from './library/parser'
// 构造函数
function APNG(url, canvas) {
    this.getImageFileFromUrl(url, "", (file) => {
        var reader = new FileReader();
        reader.onloadend = () => {
            const apng = parseAPNG(reader.result);
            if (apng instanceof Error) return;
            apng.createImages().then(() => {
                canvas.width = apng.width;
                canvas.height = apng.height;
                apng.getPlayer(canvas.getContext('2d')).then(player => {
                    player.play();
                    this._player = player;
                });
            });
        };
        reader.readAsArrayBuffer(file);
    });
}
// 播放
APNG.prototype.play = function () {
    if (this._player && this._player.paused()) this._player.play();
}
// 暂停
APNG.prototype.pause = function () {
    if (this._player && !this._player.paused()) this._player.pause();
}
// url获取file
APNG.prototype.getImageFileFromUrl = function (url, fileName, callback) {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'image/jpeg');
    xhr.responseType = "blob";
    xhr.onload = () => {
        if (xhr.status == 200) {
            blob = xhr.response;
            let imgFile = new File([blob], fileName, { type: 'image/jpeg' });
            callback.call(this, imgFile);
        }
    };
    xhr.send();
}
window.APNG = APNG;