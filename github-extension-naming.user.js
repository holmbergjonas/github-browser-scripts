// ==UserScript==
// @author       https://github.com/holmbergjonas
// @name         Github - Naming
// @version      0.1
// @description  Name PR from issue and name merge commit from issue
// @match        https://github.com/*
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-naming.user.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-naming.user.js
// ==/UserScript==

const timeout = 700;
var updatedPullRequests = [];
var updatedMergeCommits = [];

var fn = function() {
    'use strict';

    setTimeout(fn, timeout);

    const url = window.location.href;
   if(url.includes("/compare/")) // Name the pull request
    {
        // If not header actions element presented, return since this is not an issue
        if (!document.querySelector('#pull_request_title')) return;

        const url = window.location.href.split('compare')[1];
        const branchUrlName = url.split('?')[0];

        if(updatedPullRequests.includes(branchUrlName)) return;

        const branchClean = branchUrlName.replace(/\//g, "");
        const branchName = branchClean.replace(/-/g, " ");

        const nameArray = branchName.split(' ');
        const issueId = nameArray[0].replace("master...", "");
        const title = nameArray.slice(1).join(' ');

        const titleEl = document.querySelector('#pull_request_title');
        titleEl.value = `${title}, closes #${issueId}`;

        updatedPullRequests.push(branchUrlName);
    }
    else if(url.includes("/pull/")) // Name the merge commit
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
