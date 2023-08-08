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

// 找到所有行
async function getTableData(table) {
    // 获取所有行
    const rows = await table.findElements(By.css('tr'));

    // 创建一个空数组来存储表格内容
    const tableData = [];

    // 遍历行和单元格，并将内容添加到数组
    for (const row of rows) {
      const cells = await row.findElements(By.css('td'));
      const rowData = await Promise.all(cells.map(cell => cell.getText()));
      tableData.push(rowData);
    }
    return tableData
}

async function waitUntilPageLoaded() {
    await driver.get("https://www.12306.cn/index/");
    await driver.wait(until.urlContains("https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc"),  600000);
    await delay(30)

    while(true) {
      try {
        await driver.findElement(By.linkText("查询")).click()
        await delay(2)
        // Find the parent <div> element using CSS selector
        const parentDiv = await driver.findElement(By.css('#t-list'));
        // Find the <table> element within the parent <div> using CSS selector
        const table = await parentDiv.findElement(By.css('table'));
        var data = await getTableData(table)
        if hasTicket(data) {
           playAudio("./sample-6s.mp3", 10)
        }
        console.log(data)
      } catch (e) {
         console.log(e)
      }
    }
    await driver.quit()
}
waitUntilPageLoaded();