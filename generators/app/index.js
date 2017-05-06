const path = require('path');
const Generator = require('yeoman-generator');

const utils = require('./utils');

const MY_USERNAME = 'gluons';

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.props = {};
		this.argument('name', {
			description: 'Project name',
			type: String,
			required: false
		});
		this.option('mocha', {
			description: 'Use mocha as test framework',
			type: Boolean,
			alias: 'm',
			default: true
		});
		if ((typeof this.options.name === 'string') && (this.options.name.length > 0)) {
			// Name given
			this.props.name = this.options.name;
			this.props.useCwd = false;
		} else {
			// No name given
			this.props.useCwd = true;
		}
		this.props.mocha = this.options.mocha;
	}
	prompting() {
		let cwd = path.basename(process.cwd());
		let questions = [];
		if (!this.props || (this.props && !this.props.name)) {
			questions.push({
				type: 'input',
				name: 'name',
				message: 'Project name',
				default: cwd,
				validate: utils.validateName
			});
		}
		questions = questions.concat([
			{
				type: 'input',
				name: 'version',
				message: 'Version',
				default: '1.0.0'
			},
			{
				type: 'input',
				name: 'description',
				message: 'Description'
			},
			{
				type: 'input',
				name: 'author',
				message: 'Author',
				default: `${this.user.git.name()} <${this.user.git.email()}>`
			},
			{
				type: 'input',
				name: 'license',
				message: 'License',
				default: 'MIT'
			},
			{
				type: 'input',
				name: 'keywords',
				message: 'Keywords',
				filter(keywords) {
					if ((typeof keywords === 'string') && (keywords.length > 0)) {
						return utils.transformKeywords(keywords);
					} else {
						return '[]';
					}
				}
			}
		]);

		return this.prompt(questions).then(answers => {
			this.props = Object.assign({}, this.props, answers);
			return Promise.resolve();
		});
	}
	writing() {
		if (!this.props.useCwd) {
			this.destinationRoot(path.join(process.cwd(), this.props.name));
		}
		let src = this.templatePath('*');
		let dest = this.destinationPath();

		utils.getGitHubUsername(dest).then(username => {
			if (username) {
				this.props.username = username;
			} else {
				this.props.username = MY_USERNAME;
			}
		});

		this.fs.copyTpl(src, dest, this.props, {}, {
			globOptions: {
				dot: true
			}
		});
	}
	install() {
		this.yarnInstall();
	}
};
