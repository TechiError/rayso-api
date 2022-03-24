const chromium = require("chrome-aws-lambda");
let instance = null;

module.exports.getBrowser = async function () {
  if (!instance) {
    instance = await chromium.puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      headless: false,
      ignoreHTTPSErrors: true,
      executablePath:
        (await chromium.executablePath) ||
        process.env.PUPPETEER_EXECUTABLE_PATH,
    });
  }
  return instance;
};
