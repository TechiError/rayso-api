const chromium = require('chrome-aws-lambda');
const { getBrowser } = require("./browser");

async function getScreenshot(title = "Rayso",
 text="Give some text!", theme="raindrop", padding=32, background=True, darkMode=False, language=auto) {
  const browser = await getBrowser();
  const page = await browser.newPage();
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
  });
  const element = await page.$('div[id="frame"]');
  const image = await element.screenshot({ omitBackground: true});

  await page.close();
  return image
}

module.exports = getScreenshot