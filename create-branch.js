
// ==UserScript==
// @name         Github - Create branch from issue
// @version      0.1
// @run-at       document-end
// @description  This is a compact version of https://github.com/bumbeishvili/create-branch-from-issue
// @match        https://github.com/*/issues/*
// @updateURL    https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/create-branch.js
// @downloadURL  https://raw.githubusercontent.com/holmbergjonas/github-browser-scripts/main/create-branch.js
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

(function() {
    'use strict';

    const $button = document.createElement('div');
    $button.innerHTML =
        '<button id="create_branch_button" style="margin-right:10px!important;background-color:#0C61FE" class="d-inline-block float-none m-0 mr-md-0 btn btn-sm btn-primary ">Create Branch</button>';
    document.querySelector('.gh-header-actions').prepend($button);

    const repoUrl = window.location.href.split('issues')[0];

    $button.addEventListener('click', (d) => {
        $button.disable = true;
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
})();
