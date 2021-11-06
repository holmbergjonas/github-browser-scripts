// ==UserScript==
// @name         Github - Name PR after issue
// @version      0.1
// @description  Name new PR with issue name instead of first commit message
// @match        https://github.com/*/compare/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/name-pr.user.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/name-pr.user.js
// ==/UserScript==

const fn = function () {
  'use strict';
  // If not header actions element presented, return since this is not an issue
  if (!document.querySelector('#pull_request_title')) return;

  const url = window.location.href.split('compare')[1];
  const branchUrlName = url.split('?')[0];

  const branchClean = branchUrlName.replace(/\//g, "");
  const branchName = branchClean.replace(/-/g, " ");

  const nameArray = branchName.split(' ');
  const issueId = nameArray[0];
  const title = nameArray.slice(1).join(' ');


  const titleEl = document.querySelector('#pull_request_title');
  titleEl.value = `${title}, closes #${issueId}`;
};

setTimeout(fn, 300);
