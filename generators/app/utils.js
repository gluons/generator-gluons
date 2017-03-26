const validate = require('validate-npm-package-name');
const lpad = require('lpad');
const trimStart = require('trimstart');

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

module.exports = {
	validateName,
	transformKeywords
};
