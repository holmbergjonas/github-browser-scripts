// ==UserScript==
// @author       https://github.com/holmbergjonas
// Create branch button originates from https://github.com/bumbeishvili/create-branch-from-issue
// @name         Github - Branch button
// @version      0.1
// @description  Create branch from issue
// @match        https://github.com/*
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-branch.user.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/github-extensions-branch.user.js
// ==/UserScript==

const timeout = 700;
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
        .replace(/-+/g, '-') // collapse dashes
        .toLowerCase();
    return str;
}

var fn = function() {
    'use strict';

    setTimeout(fn, timeout);

    const url = window.location.href;
    if(url.includes("/issues/"))
    {
        const existingButton = document.querySelector("#create_branch_button");
        if(existingButton){
            return;
        }

        const button = document.createElement('div');
        button.innerHTML =
            '<button id="create_branch_button" style="margin-right:10px!important;background-color:#0C61FE" class="d-inline-block float-none m-0 mr-md-0 btn btn-sm btn-primary ">Create Branch</button>';
        const headerActions = document.querySelector('.gh-header-actions');
        if(headerActions == null) return;

        headerActions.prepend(button);

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
};

// We need to poll since some page changes are not changes in navigation
setTimeout(fn, timeout);
