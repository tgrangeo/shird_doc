import { createConsola } from "consola";
import { execa } from "execa";
import playwrightCore from "playwright-core";
let installedChromium = false;
let installChromiumPromise;
export async function createBrowser() {
  if (installChromiumPromise)
    await installChromiumPromise;
  if (!installedChromium) {
    installChromiumPromise = new Promise((_resolve) => {
      const logger = createConsola().withTag("Nuxt OG Image");
      logger.info("Installing Chromium install for og:image generation...");
      const installChromeProcess = execa("npx", ["playwright", "install", "chromium"], {
        stdio: "pipe"
      });
      if (installChromeProcess.stderr) {
        installChromeProcess.stderr.pipe(process.stderr);
      }
      if (installChromeProcess.stdout) {
        installChromeProcess.stdout.pipe(process.stdout);
      }
      new Promise((resolve) => {
        installChromeProcess.on("exit", (e) => {
          if (e !== 0)
            logger.error("Failed to install Playwright dependency for og:image generation. Trying anyway...");
          resolve();
        });
      }).then(() => {
        installChromeProcess.kill();
        logger.info("Installed Chromium install for og:image generation.");
        _resolve();
      });
    }).then(() => {
      installedChromium = true;
    });
  }
  return await playwrightCore.chromium.launch({
    headless: true
  });
}
