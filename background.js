let defaultKeywords = ['@major', '@minor', '@patch', '@qa'];
let tagsKey = 'tags';

chrome.runtime.onInstalled.addListener(function () {
    createDefaultTagsIfTheyDontExist();
});

function createDefaultTagsIfTheyDontExist() {
    chrome.storage.sync.get(tagsKey, function (data) {
        if (!data[tagsKey]) {
            console.log('no data found');

            let newTagsArray = {};
            newTagsArray[tagsKey] = defaultKeywords;

            chrome.storage.sync.set(newTagsArray, function () {
                console.log("new tags stored");
            });
        }
    });
}