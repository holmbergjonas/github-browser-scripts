// ==UserScript==
// @name         Github - Name merge commit after issue
// @version      0.1
// @description  Name the merge commit after the issue
// @match        https://github.com/*/pull/*
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/name-merge-commit.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/name-merge-commit.js
// ==/UserScript==

const fn = function(){
  const titleField = document.getElementsByClassName('js-issue-title');
  if (!titleField || !titleField[0]) return;

  const mergeField = document.querySelector('#merge_title_field');
  if (!mergeField) return;

  const rawTitle = titleField[0].innerHTML
  const prId = window.location.href.split('/').pop();
  const titleArray = rawTitle.split(' ');
  const title = titleArray.join(' ');

  mergeField.value = `(PR #${prId}) ${title}`;

  const mergeMessageField = document.querySelector('#merge_message_field');
  mergeMessageField.value = "";

  window.clearInterval(intervalId);
};

setTimeout(fn, 200);
