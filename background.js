chrome.runtime.onInstalled.addListener((details) => {
    chrome.contextMenus.create({
        id: "saveWithInfo",
        title: "Save with Info",
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener(async(info, tab) => {
    if (info.menuItemId === "saveWithInfo")  {

        let username = "";
        let title = "";
        let origFilename = "";
        try {
            const patternPageUrl = /https:\/\/www.tumblr.com\/([^\/]+)\/\d+\/([^\/]+)/;
            username = info.pageUrl.match(patternPageUrl)[1];
            title = info.pageUrl.match(patternPageUrl)[2];

            // Note: タイトル重複対策で、普通にファイル保存した場合の命名規則も残しておく
            const patternSrcUrl = /https:\/\/64.media.tumblr.com\/([^\/]+)\/.*/;
            origFilename = "tumblr-com-" + info.srcUrl.match(patternSrcUrl)[1];
        } catch (e) {
            chrome.tabs.sendMessage(
                tab.id,
                {
                    name: "missingUrl:background",
                }
            ).catch((e) => console.error(e));

            throw e;
        }

        console.log(username);
        console.log(title);
        console.log(origFilename);

        let filename = username + "_" + title + "_" + origFilename;

        let promise = chrome.tabs.sendMessage(
            tab.id,
            {
                name: "saveWithInfo:background",
                filename: filename,
                srcUrl: info.srcUrl
            }
        );

        promise.catch((e) => console.error(e));
    }
});
