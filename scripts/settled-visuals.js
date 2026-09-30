async (page) => {
  await page.goto('http://127.0.0.1:3016');
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('.hero-study').getByRole('button',{name:'system',exact:true}).click();
  await page.waitForTimeout(750);
  await page.screenshot({path:'output/playwright/system-settled-desktop.png'});
  await page.locator('.flagship-study').getByRole('button',{name:'system',exact:true}).click();
  await page.waitForTimeout(750);
  await page.locator('.flagship-sticky').screenshot({path:'output/playwright/flagship-settled.png'});
  await page.setViewportSize({width:390,height:844});
  await page.locator('.hero-study').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));
  await page.waitForTimeout(750);
  await page.screenshot({path:'output/playwright/system-settled-mobile.png'});
  return {
    heroSystemOpacity:await page.locator('.hero-study .system-layer').evaluate(el=>getComputedStyle(el).opacity),
    heroSurfaceOpacity:await page.locator('.hero-study .surface-layer').evaluate(el=>getComputedStyle(el).opacity)
  };
}
