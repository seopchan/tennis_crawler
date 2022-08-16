import http from "http";
import url from "url";
import bot from "./telegramBot/telegramBot.js";
import getKataList from "./controller/kata/kataController.js";
import cheerio from "cheerio";
import fs from "fs";
import string from "./data/string/string.js";

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var query = url.parse(request.url).query;

    route(handle, pathname, response, query); // injected function call
  }

  http.createServer(onRequest).listen(8888);

  console.log('server has started.');

  function sendMessageToChannel(message) {
    const id = "-1001407369408";
    bot.sendMessage(id, message);
  }

  async function crawling() {
      await getKataList().then(async html => {
        let newList = [];
        let a = {};
        const $ = cheerio.load(html.data);

        //기존 리스트와 비교하여 새로 추가되면 알림!
        const $bodyList = $("#AppBody > div.l_apply_list > div:nth-child(2) > dl > dd")
        $bodyList.each(function (i, elem) {
          const title = $(this).find("p").text().trim();
          if (title) {
            newList.push(title + "\n");
          }
        });

        let isSame = false;
        fs.readFile("competition.txt", 'utf-8', (e, data) => {
          if (e) {
            console.log(e)
          } else {
            if (data) {
              const originList = data.split(",");
              const updated = newList.filter(item => !originList.includes(item));
              const differentList = newList
                .filter(item => !originList.includes(item))
                .concat(originList.filter(item => !newList.includes(item)));
              if (!differentList.length) {
                isSame = true;
              }

              if (updated.length) {
                sendMessageToChannel(
                  string.CURRENT
                  + newList.toString()
                  + string.LINE
                  + updated.toString()
                  + string.START
                  + string.RESERVATION
                );
              }
            }
          }
        });

        if (!isSame) {
          fs.writeFile("competition.txt", newList.toString(), 'utf8', () => {
            console.log("writeFile");
          });
        }
      });
  }

  //크롤링 반복 30초마다
  setInterval(crawling, 30000);
}

export default start;