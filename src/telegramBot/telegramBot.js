// replace the value below with the Telegram token you receive from @BotFather
import TelegramBot from "node-telegram-bot-api";
import getKataList from "../controller/kata/kataController.js";
import cheerio from "cheerio";
import string from "../data/string/string.js";

const token = "5786394194:AAEFEgm8d20anceQIDWMVx1CmYveIhvZTdE";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

console.log('bot start!');

// Matches "/find [대회 이름]"
bot.onText(/\/검색 (.+)/, async (msg, match) => {
  const competitionId = match[1]; // the captured "whatever"

  await getKataList().then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("#AppBody > div.l_apply_list > div:nth-child(2) > dl > dd")

    let isExist = "접수가 시작되지 않았습니다.\n\n";

    $bodyList.each(function (i, elem) {
      const title = $(this).find("p").text().trim();

      if (title) {
        ulList.push(title + "\n");
      }

      if (title.trim() === competitionId) {
        isExist = competitionId + string.START;
      }
    });

    bot.sendMessage(msg.chat.id,
      string.CURRENT
      + ulList.toString()
      + string.LINE
      + isExist
      + string.RESERVATION_KATA
    );
  });
});

bot.onText(/\/검색$/, async (msg) => {
  const chatId = msg.chat.id;

  await getKataList().then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("#AppBody > div.l_apply_list > div:nth-child(2) > dl > dd")

    $bodyList.each(function (i, elem) {
      const title = $(this).find("p").text().trim();
      if (title) {
        ulList.push(title + "\n");
      }
    });

    bot.sendMessage(chatId,
      string.CURRENT
      + ulList.toString()
      + string.LINE
      + string.RESERVATION_KATA
    );
  });
});

export default bot;