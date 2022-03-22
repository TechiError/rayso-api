const chromium = require('chrome-aws-lambda');

async function getScreenshot(title, text, theme, padding, background, darkMode, language) {
  
  const browser = await chromium.puppeteer.launch({
  args: [
    "--proxy-server='direct://'",
    '--proxy-bypass-list=*',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
  ],
  headless: true,
  ignoreHTTPSErrors: true,
  executablePath: await chromium.executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
});
const page = await browser.newPage();
await browser.setViewportSize({
  width: 1920,
  
  await page.setViewportSize({
    width: 8192,
    height: 2048,
  });
  var page_url = `https://ray.so/?title=${encodeURIComponent(
    title,
  )}&theme=${theme}&spacing=${padding}&background=${background
    }&darkMode=${darkMode}&code=${encodeURIComponent(
      Buffer.from(text).toString('base64'),
    )}&language=${encodeURIComponent(language)}`;
  await page.goto(page_url)

  await page.evaluate(() => {
    document.querySelector(
      '#frame > div.drag-control-points > div.handle.left',
    ).style.display = 'none';
    document.querySelector(
      '#frame > div.drag-control-points > div.handle.right',
    ).style.display = 'none';
    document.querySelector('#app > main > section').style.display =
      'none';
    document.querySelector(
      '#frame > div.app-frame-container > div.app-frame',
    ).style.borderRadius = '0';
  });
  const element = await page.$('div[id="frame"]');
  const image = await element.screenshot({ omitBackground: true, path: './rayso.png' });

  await browser.close();
  return image
}
getScreenshot('RaySo', 'Give Some codes DUDE!', 'raindrop', 64, true, true, 'auto')
module.exports = getScreenshot