import url from "url";
import bot from "./telegramBot/telegramBot.js";
import getKataList from "./controller/kata/kataController.js";
import cheerio from "cheerio";
import fs from "fs";
import string from "./data/string/string.js";
import http from "http";
import getKatoList from "./controller/kato/katoController.js";
import {commaToHotPoint} from "./util/converter.js"
import getKtaList from "./controller/kta/ktaController.js";
import iconv from 'iconv-lite';

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var query = url.parse(request.url).query;

    route(handle, pathname, response, query); // injected function call
  }

  http.createServer(onRequest).listen(8888);

  console.log('server has started.');

  function handleData(data, newList) {
    let compareResult = false;
    const originList = data.split(",");

    const updated = newList.filter(item => !originList.includes(item));

    const differentList = newList
      .filter(item => !originList.includes(item))
      .concat(originList.filter(item => !newList.includes(item)));
    if (!differentList.length) {
      compareResult = true;
    }

    return {updated, compareResult};
  }

  async function crawlingKata() {
    await getKataList().then(async html => {
      let newList = [];
      const $ = cheerio.load(html.data);

      const $bodyList = $("#AppBody > div.l_apply_list > div:nth-child(2) > dl > dd")
      $bodyList.each(function (i, elem) {
        const title = commaToHotPoint($(this).find("p").text().trim());
        if (title) {
          newList.push(title + "\n");
        }
      });

      let isSame = false;
      fs.readFile("competitionKata.txt", 'utf-8', (e, data) => {
        if (e) {
          console.log(e)
        } else {
          if (data) {
            const {updated, compareResult} = handleData(data, newList);
            isSame = compareResult;

            if (updated.length) {
              bot.sendMessage(
                "-1001407369408",
                string.CURRENT
                + newList.toString()
                + string.LINE
                + updated.toString()
                + string.START
                + string.RESERVATION_KATA
              );
            }
          }
        }
      });

      if (!isSame) {
        fs.writeFile("competitionKata.txt", newList.toString(), 'utf8', () => {
          console.log("writeFile_KATA");
        });
      }
    });
  }

  async function crawlingKato() {
    await getKatoList().then(async html => {
      let newList = [];
      const $ = cheerio.load(html.data);

      const $bodyList = $("#containers > div:nth-child(1) > div > table > tbody > tr > td.title-sector > div.title > a");
      $bodyList.each(function (i, elem) {
        const title = commaToHotPoint($(this).text().trim());
        if (title) {
          newList.push(title + "\n");
        }
      });

      let isSame = false;
      fs.readFile("competitionKato.txt", 'utf-8', (e, data) => {
        if (e) {
          console.log(e)
        } else {
          if (data) {
            const {updated, compareResult} = handleData(data, newList);
            isSame = compareResult;

            if (updated.length) {
              bot.sendMessage(
                "-1001225340892",
                string.CURRENT
                + newList.toString()
                + string.LINE
                + updated.toString()
                + string.START
                + string.RESERVATION_KATO
              );
            }
          }
        }
      });

      if (!isSame) {
        fs.writeFile("competitionKato.txt", newList.toString(), 'utf8', () => {
          console.log("writeFile_KATO");
        });
      }
    });
  }

  async function crawlingKta() {
    await getKtaList().then(async html => {
      let newList = [];

      const utf8Html = iconv.decode(html.data, "EUC-KR");
      const $ = cheerio.load(utf8Html);

      const $bodyList = $("body > center > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(15) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td.left_menu_btn > a");
      $bodyList.each(function (i, elem) {
        const title = commaToHotPoint($(this).attr("title").trim());
        const $isStart = $(`body > center > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(15) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(${(i+1)+i}) > td.left_menu_btn > img`);
        const isStart = Boolean("../skin/leftmenu/main_navi/img/apply.gif" === $isStart.attr("src").toString());

        if (title && isStart) {
          newList.push(title + "\n");
        }
      });


      let isSame = false;
      fs.readFile("competitionKta.txt", 'utf-8', (e, data) => {
        if (e) {
          console.log(e)
        } else {
          if (data) {
            const {updated, compareResult} = handleData(data, newList);
            isSame = compareResult;

            if (updated.length) {
              bot.sendMessage(
                "-1001782955784",
                string.CURRENT
                + newList.toString()
                + string.LINE
                + updated.toString()
                + string.START
                + string.RESERVATION_KTA
              );
            }
          }
        }
      });

      if (!isSame) {
        fs.writeFile("competitionKta.txt", newList.toString(), 'utf8', () => {
          console.log("writeFile_KTA");
        });
      }
    });
  }

  async function crawling() {
    crawlingKata();
    crawlingKato();
    crawlingKta();
  }

  //크롤링 반복 20초마다
  setInterval(crawling, 20000);
}

export default start;