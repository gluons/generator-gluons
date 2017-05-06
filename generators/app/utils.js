const fs = require('fs');
const getRepoInfo = require('git-repo-info');
const githubUsername = require('github-username');
const isGit = require('is-git-repository').default;
const lpad = require('lpad');
const parseAuthor = require('parse-author');
const trimStart = require('trimstart');
const validate = require('validate-npm-package-name');

function validateName(name) {
	let validationResult = validate(name);
	let errorsMsg = '';
	if (Array.isArray(validationResult.warnings)) {
		errorsMsg += validationResult.warnings.join('\n');
	}
	if (Array.isArray(validationResult.errors)) {
		errorsMsg += errorsMsg.length > 0 ? '\n' : '';
		errorsMsg += validationResult.errors.join('\n');
	}
	if (validationResult.validForNewPackages) {
		return true;
	} else {
		return errorsMsg;
	}
}

function transformKeywords(keywords) {
	let keywordsStr = JSON.stringify(keywords.split(','), null, 2);
	keywordsStr = trimStart(lpad(keywordsStr, '  '));
	return keywordsStr;
}

function getGitHubUsername(path) {
	if (fs.existsSync(path) && isGit(path)) {
		let repoInfo = getRepoInfo(path);

		if (repoInfo && repoInfo.author) {
			let author = parseAuthor(repoInfo.author);

			if (author && author.email) {
				return githubUsername(author.email);
			}
		}
	}

	return Promise.resolve(null);
}

module.exports = {
	getGitHubUsername,
	transformKeywords,
	validateName
};
