// ==UserScript==
// @name         Github - Create branch from issue, Name PR from issue and name merge commit from issue
// @version      0.1
// @description  Create branch button is partially similar to https://github.com/bumbeishvili/create-branch-from-issue
// @match        https://github.com/*
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions.user.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions.user.js
// ==/UserScript==

function stringToSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    const fromLetter = 'şğàáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const toLetter = 'sgaaaaeeeeiiiioooouuuunc------';
    for (let i = 0, l = fromLetter.length; i < l; i++) {
        str = str.replace(new RegExp(fromLetter.charAt(i), 'g'), toLetter.charAt(i));
    }
    str = str
        .replace(/[^a-zA-Z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    return str;
}

const timeout = 800;
var updatedPullRequests = [];
var updatedMergeCommits = [];

var fn = function() {
    'use strict';

    setTimeout(fn, timeout);

    const url = window.location.href;
    if(url.includes("/issues/"))
    {
        console.log("Issue");
        const existingButton = document.querySelector("#create_branch_button");
        if(existingButton){
            return;
        }

        console.log("Issue perform");
        const button = document.createElement('div');
        button.innerHTML =
            '<button id="create_branch_button" style="margin-right:10px!important;background-color:#0C61FE" class="d-inline-block float-none m-0 mr-md-0 btn btn-sm btn-primary ">Create Branch</button>';
        document.querySelector('.gh-header-actions').prepend(button);

        const repoUrl = window.location.href.split('issues')[0];

        button.addEventListener('click', (d) => {
            button.disable = true;
            const issueTitle = document.querySelector('.js-issue-title').innerText;
            const issueId = window.location.pathname.split('/').pop();
            const branchTitle = stringToSlug(`${issueId} - ${issueTitle}`);

            let branch = 'master';

            fetch(`${repoUrl}refs/${branch}?source_action=disambiguate&source_controller=files`)
                .then((d) => d.text())
                .then((d) => {
                const $el = document.createElement('div');
                $el.innerHTML = d;
                const $form = $el.querySelector('form');
                const $name = $form.querySelector('#name');
                $name.value = branchTitle;
                document.body.appendChild($form);
                $form.submit();
            });
        });
    }
    else if(url.includes("/compare/")) // Name the pull request
    {
        console.log("Compare");
        // If not header actions element presented, return since this is not an issue
        if (!document.querySelector('#pull_request_title')) return;

        const url = window.location.href.split('compare')[1];
        const branchUrlName = url.split('?')[0];

        if(updatedPullRequests.includes(branchUrlName)) return;

        console.log("Compare perform");

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
        console.log("Pull");
        const prId = window.location.href.split('/').pop();
        if(updatedMergeCommits.includes(prId)) return;

        const titleField = document.getElementsByClassName('js-issue-title');
        if (!titleField || !titleField[0]) return;

        const mergeField = document.querySelector('#merge_title_field');
        if (!mergeField) return;

        if(!(window.getComputedStyle(mergeField).display === "none")) return;

        console.log("Pull perform");

        const rawTitle = titleField[0].innerHTML
        const titleArray = rawTitle.split(' ');
        const title = titleArray.join(' ');

        mergeField.value = `(PR #${prId}) ${title}`;

        const mergeMessageField = document.querySelector('#merge_message_field');
        mergeMessageField.value = "";

        updatedMergeCommits.push(prId);
    }
};

// We need to poll since GitHub does not redirect to new pages but calls them using javascript
setTimeout(fn, timeout);
