// ==UserScript==
// @author       https://github.com/holmbergjonas
// @name         Github - Name pr with branch name
// @version      0.2
// @description  Name PR from branch
// @match        https://github.com/*
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-name-pr.user.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-name-pr.user.js
// ==/UserScript==

const timeout = 700;
var updatedPullRequests = [];

var fn = function () {
    'use strict';

    setTimeout(fn, timeout);

    const url = window.location.href;
    if (url.includes("/compare/")) // Name the pull request
    {
        // If not header actions element presented, return since this is not an issue
        if (!document.querySelector('#pull_request_title')) return;

        const url = window.location.href.split('compare')[1];
        const branchUrlName = url.split('?')[0];

        if (updatedPullRequests.includes(branchUrlName)) return;

        const branchClean = branchUrlName.replace(/\//g, "");
        const branchParts = branchClean
            .replace(/-/g, " ")
            .replace("master...", "")
            .split(" ")

        const title = branchParts.slice(2).join(' ');

        const titleEl = document.querySelector('#pull_request_title');
        titleEl.value = `${branchParts[0]}-${branchParts[1]}: ${title}`;

        updatedPullRequests.push(branchUrlName);
    }
};

// We need to poll since some page changes are not changes in navigation
setTimeout(fn, timeout);
