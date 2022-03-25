const chromium = require("chrome-aws-lambda");
const playwright = require('playwright-core');
let instance = null;

module.exports.getBrowser = async function () {
  if (!instance) {
    instance = await playwright.chromium.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      headless: true,
      ignoreHTTPSErrors: true,
      executablePath:
        (await chromium.executablePath) ||
        process.env.BROWSER_EXECUTABLE_PATH,
    });}
    return await instance.newContext();
  return instance;
};