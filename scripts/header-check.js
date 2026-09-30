async (page) => {
  await page.goto('http://127.0.0.1:3016');
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('.hero-study').getByRole('button',{name:'system',exact:true}).click();
  await page.locator('.hero-study.mode-system').waitFor();
  await page.locator('.hero-study').getByRole('button',{name:'surface',exact:true}).click();
  await page.locator('.hero-study.mode-surface').waitFor();
  await page.evaluate(()=>scrollTo({top:400,behavior:'instant'}));
  await page.waitForTimeout(500);
  const compact=await page.locator('.header-inner').evaluate(el=>el.getBoundingClientRect().height);
  await page.waitForTimeout(600);
  const settled=await page.locator('.header-inner').evaluate(el=>el.getBoundingClientRect().height);
  await page.evaluate(()=>scrollTo({top:300,behavior:'instant'}));
  await page.waitForTimeout(500);
  const expanded=await page.locator('.header-inner').evaluate(el=>el.getBoundingClientRect().height);
  if(compact!==68 || settled!==68 || expanded!==90)throw new Error(JSON.stringify({compact,settled,expanded}));
  return {compact,settled,expanded};
}
