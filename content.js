chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.name === "saveWithInfo:background") {
        download(request.filename, request.srcUrl);
    }

    // うまくURLが取得的ないときはダイアログを出す
    if (request.name === "missingUrl:background") {
        alert("URL Missing");
    }
});

// Note: サーバ側の設定の問題でaタグをクリックしたことにする方法が使えない(ページが開いてしまう)場合はバイナリとして保存
// この方式が必要なサイト(2025/4): Tumblr
function download(filename, url) {
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            let downloadTag = document.createElement('a');
            downloadTag.addEventListener('click', async () => {
                const Extensions = {
                    "image/png": ".png",
                    "image/jpeg": ".jpg",
                    "image/gif": ".gif",
                    "image/bmp": ".bmp",
                    "image/webp": ".webp",
                    "image/svg.xml": ".svg",
                    "image/apng": ".apng",
                    "image/tiff": ".tiff",
                    "image/icon": ".ico"
                }

                const opts = {
                    suggestedName: filename + Extensions[blob.type],
                };
                try{
                    const handle = await window.showSaveFilePicker(opts);
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                } catch(e){
                    if (e instanceof AbortError) {
                        // 保存をキャンセルした場合も catch してしまうのでログだけ出して抜ける
                        console.log(e);
                    } else {
                        alert(e);
                    }
                }
            })
            downloadTag.click();
        });
}
