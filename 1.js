const { Builder, By, Key, until } = require('selenium-webdriver');
let driver = new Builder().forBrowser('chrome').build();
async function delay(seconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
}

const player = require('play-sound')();

function playAudio(file, times) {
    if (times <= 0) {
      console.log('音频播放完成', 0);
      return;
    }
    player.play(file, (err) => {
      if (err) {
        console.error('播放音频时发生错误:', err);
      } else {
        console.log('音频播放完成', times);
        playAudio(file, times - 1); // 递归调用，次数减一
      }
    });
  }
async function waitUntilPageLoaded() {
    await driver.get("https://www.12306.cn/index/");
    playAudio("/Users/kingwang/Downloads/sample-6s.mp3", 10)
    await delay(300)

    await driver.findElement(By.linkText("密码登录")).click()
    await delay(1)
    await driver.findElement(By.id("agree")).click()
    await delay(1)
    await driver.findElement(By.css(".Button_button_3onsJ")).click()
    await delay(5)
    // 在这里执行您的其他操作
    await driver.quit()
}

waitUntilPageLoaded();