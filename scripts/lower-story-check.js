async (page) => {
  const checks = [];
  const check=(name,pass,detail)=>checks.push({name,pass,detail});
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://127.0.0.1:3018');
  await page.locator('.career-trigger').first().click();
  await page.locator('#career').evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-110,behavior:'instant'}));
  await page.screenshot({path:'output/playwright/career-desktop-v3.png'});
  await page.locator('.career-trigger').nth(3).hover();
  check('career shared detail',await page.locator('#career-detail h3').innerText()==='Software Engineer Intern');
  const bounds=await page.locator('#process').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.getBoundingClientRect().height}));
  for(const [phase,fraction,expected] of [['arrival',0,0],['middle',.5,2],['end',.9,4]]){
    await page.evaluate(({bounds,fraction})=>window.scrollTo({top:bounds.top-100+(bounds.height-innerHeight+100)*fraction,behavior:'instant'}),{bounds,fraction});
    await page.waitForTimeout(200);
    check('process '+phase,Number(await page.locator('#process').getAttribute('data-active-stage'))===expected);
    await page.screenshot({path:`output/playwright/process-${phase}-v3.png`});
  }
  await page.locator('#study').evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-120,behavior:'instant'}));
  for(let i=0;i<4;i++){
    await page.locator('.study-stage-nav button').nth(i).click();
    await page.waitForTimeout(750);
    await page.screenshot({path:`output/playwright/study-${i}-v3.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('#career').evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-90,behavior:'instant'}));
  await page.screenshot({path:'output/playwright/career-mobile-v3.png'});
  await page.locator('.career-milestone').nth(2).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight*.4,behavior:'instant'}));
  await page.waitForTimeout(150);
  check('mobile career centered reading',await page.locator('.career-milestone.is-active .career-stage').innerText()==='DEGREE');
  await page.locator('#process').evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-90,behavior:'instant'}));
  await page.screenshot({path:'output/playwright/process-mobile-v3.png'});
  await page.locator('#study').evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-90,behavior:'instant'}));
  await page.screenshot({path:'output/playwright/study-mobile-v3.png'});
  check('mobile no cursor',await page.locator('.custom-cursor').evaluate(el=>getComputedStyle(el).display==='none'));
  return checks;
}

