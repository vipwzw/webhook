const { Builder, By, Key, until } = require('selenium-webdriver');
let driver = new Builder().forBrowser('chrome').build();
async function delay(seconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
}

const player = require('play-sound')();

async function playAudio(musicPath) {
    // 播放音乐
    const playerPromise = new Promise((resolve, reject) => {
      player.play(musicPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // 等待音乐播放完成
    return playerPromise;
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

function hasTicket(tabledata) {
    console.log("beg", tabledata.length)
    for (var i = 0; i < tabledata.length; i++) {
        if (hasTicketRow(tabledata[i])) {
            return true
        }
    }
    console.log("end", tabledata.length)
    return false
}

function hasTicketRow(row) {
    for (var i = 1; i < row.length; i++) {
        const item = row[i]
        if (item == "--" || item == "候补" || item == "预定") {
            continue
        }
        if (item == "有") {
            return true
        }
        var ticketNumber = parseInt(item)
        if (!isNaN(ticketNumber) && ticketNumber > 0) {
            console.log(row[0], "有 ", ticketNumber, " 张票。")
            return true
        }
    }
    return false
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
        if (hasTicket(data)) {
            for (var i = 0; i < 10; i++) {
                await playAudio("./sample-6s.mp3")
            }
        }
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    }
    await driver.quit()
}
waitUntilPageLoaded();