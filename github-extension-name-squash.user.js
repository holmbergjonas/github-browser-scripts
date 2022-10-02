// ==UserScript==
// @author       https://github.com/holmbergjonas
// @name         Github - Name squash from branch
// @version      0.1
// @description  Name name merge commit from branch
// @match        https://github.com/*
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-name-squash.user.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-name-squash.user.js
// ==/UserScript==

const timeout = 700;
var updatedMergeCommits = [];

var fn = function() {
    'use strict';

    setTimeout(fn, timeout);

    const url = window.location.href;
    if(url.includes("/pull/"))
    {
        const prId = window.location.href.split('/').pop();
        if(updatedMergeCommits.includes(prId)) return;

        const titleField = document.getElementsByClassName('js-issue-title');
        if (!titleField || !titleField[0]) return;

        const mergeField = document.querySelector('#merge_title_field');
        if (!mergeField) return;

        const rawTitle = titleField[0].innerHTML
        const titleArray = rawTitle.split(' ');
        const title = titleArray.join(' ');

        mergeField.value = `(PR #${prId}) ${title}`;

        const mergeMessageField = document.querySelector('#merge_message_field');
        mergeMessageField.value = "";

        updatedMergeCommits.push(prId);
    }
};

// We need to poll since some page changes are not changes in navigation
setTimeout(fn, timeout);
