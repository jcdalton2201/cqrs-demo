const chalk = require('chalk');
const mkdirp = require('mkdirp');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

class NewRoute {
    constructor() {
        if (argv.name) {
            let paths = argv.name.split('/');
            let name = argv.name;
            let dir = '';
            if (paths.length > 1) {
                name = paths.pop();
                dir = `/${paths.join('/')}`;
            }
            console.log(
                chalk.green(
                    `We are going to build component ${name} in dir ${chalk.yellow(
                        dir
                    )}`
                )
            );
            this._buildDir(name, dir);
            this._buildJs(name, dir);
        } else {
            console.log(chalk.red('Please add the argument --name=<<name>>'));
        }
    }
    /**
     * This will convert slug string to Camel Cased
     * @param {String} val value of string to change
     */
    __camelCased(val) {
        return val
            .toLocaleLowerCase()
            .split('-')
            .map((item) => item.replace(/^./, (c) => c.toLocaleUpperCase()))
            .join('');
    }
    /**
     *
     * @param {String} name
     * @param {String} dir
     */
    _buildDir(name) {
        mkdirp.sync(`app/routes/${name}`);
        console.log(
            chalk.green(`we have created a directory at app/routes/${name}`)
        );
    }
    /**
     *
     * @param {String} name
     * @param {String} dir
     */
    _buildJs(name) {
        const file = `app/routes/${name}/${name}-route.js`;
        const writeStream = fs.createWriteStream(file);
        writeStream.write(`
const BaseRoute = require('../baseRoute.js');
module.exports = class ${this.__camelCased(name)}Route extends BaseRoute{
    constructor(server) {
        super(server);
        this.bindMethods([]);
        this.createRoutes();
    }
    createGets(){
    }
    createPost(){}
    createPuts(){}
    createDel(){}
};
`);
    }
}
new NewRoute();