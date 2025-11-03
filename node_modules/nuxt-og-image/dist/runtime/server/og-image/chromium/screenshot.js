import { useNitroOrigin } from "#site-config/server/composables";
import { joinURL, withQuery } from "ufo";
import { toValue } from "vue";
import { useOgImageRuntimeConfig } from "../../utils.js";
export async function createScreenshot({ basePath, e, options, extension }, browser) {
  const { colorPreference } = useOgImageRuntimeConfig();
  const path = options.component === "PageScreenshot" ? basePath : joinURL("/__og-image__/image", basePath, `og.html`);
  const page = await browser.newPage({
    colorScheme: colorPreference || "no-preference",
    baseURL: useNitroOrigin(e)
  });
  try {
    if (import.meta.prerender && !options.html) {
      options.html = await e.$fetch(path).catch(() => void 0);
    }
    await page.setViewportSize({
      width: toValue(options.width) || 1200,
      height: toValue(options.height) || 630
    });
    if (options.html) {
      const html = options.html;
      await page.evaluate((html2) => {
        document.open("text/html");
        document.write(html2);
        document.close();
      }, html);
      await page.waitForLoadState("networkidle");
    } else {
      await page.goto(withQuery(path, options.props), {
        timeout: 1e4,
        waitUntil: "networkidle"
      });
    }
    const screenshotOptions = {
      timeout: 1e4,
      animations: "disabled",
      type: extension === "png" ? "png" : "jpeg"
    };
    const _options = options.screenshot || {};
    if (_options.delay)
      await page.waitForTimeout(_options.delay);
    if (_options.mask) {
      await page.evaluate((mask) => {
        for (const el of document.querySelectorAll(mask))
          el.style.display = "none";
      }, _options.mask);
    }
    if (_options.selector)
      return await page.locator(_options.selector).screenshot(screenshotOptions);
    return await page.screenshot(screenshotOptions);
  } finally {
    await page.close();
  }
}
