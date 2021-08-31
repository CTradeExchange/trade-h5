const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const child_process = require('child_process')

function resolvePath (_path) {
    return path.join(__dirname, _path)
}

function queryThemes (params) {
    return new Promise(resolve => {
        fs.readdir(resolvePath('../src/themes'), { withFileTypes: true }, (err, files) => {
            const directory = []
            for (const file of files) {
                if (file.isDirectory()) {
                    directory.push(file.name)
                }
            }
            resolve(directory)
        })
    })
}

async function init () {
    const themes = await queryThemes()
    const questions = [
        {
            type: 'list',
            name: 'buildType',
            message: '构建单个WP插件还是构建所有的WP插件',
            choices: ['h5', 'wp-editor'],
            default: 'h5',
        },
        {
            type: 'list',
            name: 'theme',
            message: '请选择构建主题',
            choices: themes,
            when: (answers) => answers.buildType === 'h5',
            default: 'false',
        },
    ]
    inquirer.prompt(questions)
        .then((answers) => {
            console.log(answers)
            Object.assign(process.env, answers)
            const command = answers.buildType === 'h5' ? 'npm run dev_h5' : 'npm run dev_admin'
            child_process.execSync(command, { stdio: [0, 1, 2] })
        })
}
init()
