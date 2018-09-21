let tagsKey = 'tags';

chrome.storage.sync.get(tagsKey, function (data) {
    let allowableTags = data[tagsKey];

    if (allowableTags.length === 0) {
        console.log('[Merge Guardian]: No tags founds. Please update using options on extension');
        return;
    }

    let tagsRegEx = new RegExp(allowableTags.join('|'), 'g');
    let hasAddedClickableLinks = false;
    let isDisabled = false;

    $("#fulfill-pullrequest").on("click", function () {
        setTimeout(function () {
            createClickableLinks();

            toggleMergeButton(true);

            $("#id_commit_message").on("keyup", function () {
                if (!isDisabled) {
                    if ($(this).val().match(tagsRegEx)) {
                        toggleMergeButton(false);
                    } else {
                        toggleMergeButton(true);
                    }
                }
            });
        }, 1000);
    });

    function toggleMergeButton(isDisabled) {
        $(".dialog-button-panel button[resolved]").prop('disabled', isDisabled);
    }


    function createClickableLinks() {
        if (hasAddedClickableLinks)
            return;

        const $commitMsgGrp = $('#id_commit_message_group');

        allowableTags.forEach(tag => {
            const $tag = $('<a href="javascript:void(0)">' + tag + '</a>')
            $tag.click(function () { addTagToCommitMsg(tag) });

            $commitMsgGrp.append($tag);
            $commitMsgGrp.append(' ');
        });

        const $disableToggle = $('<a href="javascript:void(0)">[disable]</a>');
        $disableToggle.click(() => {
            if (!isDisabled) {
                $disableToggle.text('[enable]');
                isDisabled = true;
                toggleMergeButton(false);
            } else {
                $disableToggle.text('[disable]');
                isDisabled = false;
                $("#id_commit_message").trigger('keyup');
            }
        });

        $commitMsgGrp.append('&nbsp;&nbsp;');
        $commitMsgGrp.append($disableToggle);

        hasAddedClickableLinks = true;
    }

    function addTagToCommitMsg(tagName) {
        let $commitMsg = $("#id_commit_message");
        let commitMsgVal = $commitMsg.val();
        $commitMsg.val(commitMsgVal.replace(tagsRegEx, '').trimEnd() + '\n\n' + tagName);
        $commitMsg.focus();
        $(".dialog-button-panel button[resolved]").prop('disabled', false);
    }
});