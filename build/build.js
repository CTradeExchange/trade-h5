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
            console.log(111)
            console.log(err)
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
            name: 'theme',
            message: '请选择构建主题',
            choices: themes,
            default: 'false',
        },
    ]
    inquirer.prompt(questions)
        .then((answers) => {
            console.log(answers)
            // Object.assign(process.env, answers)
            child_process.execSync('npm run build', { stdio: [0, 1, 2] })
        })
}
init()
