let tagsKey = 'tags';
let delimiter = ',';

$(function () {
    let $textarea = $("textarea");

    chrome.storage.sync.get(tagsKey, function (data) {
        let commaSeperatedList = data[tagsKey].join(delimiter);
        $textarea.val(commaSeperatedList);
    });


    $("#saveBtn").click(function () {
        let txtVal = $textarea.val().trim();

        let seperatedData = txtVal
            ? $textarea.val().trim().replace(/,\s*$/, "").split(delimiter)
            : [];

        let newTagsArray = {};
        newTagsArray[tagsKey] = seperatedData;

        chrome.storage.sync.set(newTagsArray, function () {
            $.notify('Saved', 'success');
        });
    });
});