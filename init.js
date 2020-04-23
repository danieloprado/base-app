/* eslint-disable */
const fs = require('fs');
const inquirer = require('inquirer');
const lodash = require('lodash');
const ora = require('ora');
const childProcess = require('child_process');

async function init() {
  const params = await askParams();

  const files = [
    `${__dirname}/docs/INFORMAÇÕES.md`,
    `${__dirname}/android/app/build.gradle`,
    `${__dirname}/android/app/src/main/AndroidManifest.xml`,
    `${__dirname}/android/app/src/main/java/br/com/waproject/app/MainActivity.java`,
    `${__dirname}/android/app/src/main/java/br/com/waproject/app/MainApplication.java`,
    `${__dirname}/android/app/src/main/res/values/strings.xml`,
    `${__dirname}/ios/reactApp.xcodeproj/project.pbxproj`,
    `${__dirname}/ios/reactApp/Info.plist`,
    `${__dirname}/scripts/generate-key.js`,
    `${__dirname}/android/fastlane/Appfile`,
    `${__dirname}/ios/fastlane/Appfile`,
  ];

  for (let f of files) {
    await replaceContent(f, params);
  }

  await runScript(`${__dirname}/scripts/generate-key.js`, [false]);
  await runScript(`${__dirname}/scripts/config-firebase.js`, [null], 'Deseja configurar o Firebase agora?');
  await runScript(`${__dirname}/scripts/config-sentry.js`, [null], 'Deseja configurar o Sentry?');

  fs.copyFileSync('./.env.example', './.env');

  await resetGit(params);
  await selfDestruction();

  console.log('\n**********************************************************');
  console.log('Completo!');
  console.log('Lembre-se de criar o arquivo .env antes de iniciar o app');
  console.log('**********************************************************\n');
}

async function resetGit(params) {
  const originalRepo = await execCommand('git remote get-url origin');
  await execCommand('git remote remove origin');
  await execCommand(`git remote add seed ${originalRepo}`);

  if (params.repository) {
    await execCommand(`git remote add origin ${params.repository}`);
  }

  await execCommand('git add . && git commit -am "initial"');
}

async function selfDestruction() {
  await new Promise((resolve, reject) => rimraf('./init.js', err => (err ? reject(err) : resolve())));
}

async function askParams(answers = {}) {
  const params = await inquirer.prompt([{
    name: 'appId',
    default: answers.appId,
    validate: i => i.length >= 3 ? true : 'Pelo menos 3 letras',
    message: 'App Id (ex. br.com.waproject.base)'
  }, {
    name: 'appName',
    default: answers.appName,
    validate: i => i.length >= 3 ? true : 'Pelo menos 3 letras',
    message: 'Nome do app'
  }, {
    name: 'repository',
    default: answers.repository,
    message: 'Repositorio'
  }, {
    name: 'confirmed',
    type: 'confirm',
    message: 'Confirma as configurações?'
  }]);

  if (!params.confirmed) {
    console.log('---- Responda novamente:');
    return askParams(params);
  }

  params.slug = lodash.camelCase(params.appName).toLowerCase();

  return params;
}

async function replaceContent(path, { appId, appName, slug }) {
  let content = fs.readFileSync(path, 'utf8');

  content = content
    .replace(/br\.com\.waproject\.base/gim, appId)
    .replace(/waproject/gm, slug)
    .replace(/Wa\sProject/gim, appName);

  fs.writeFileSync(path, content);
}

async function runScript(script, params, ask) {
  console.log('\n-----------------------------------\n\n');

  if (ask) {
    const { confirmed } = await inquirer.prompt([{
      name: 'confirmed',
      type: 'confirm',
      message: ask
    }]);

    if (!confirmed) return;
  }

  await require(script)(...params);
}

init().then(() => {
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(-1);
});
