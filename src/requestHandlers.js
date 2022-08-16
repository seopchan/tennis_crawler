import getKataList from "./controller/kata/kataController.js";
import cheerio from "cheerio";
import string from "./data/string/string.js";

function view(response) {
  response.writeHead(200, {'Content-Type' : 'text/plain'});
  response.write("Hello View");
  response.end();
}

function create(response) {
  console.log('request handler called --&gt; create');

  response.writeHead(200, {'Content-Type' : 'text/plain'});
  response.write('Hello Create');
  response.end();
}

async function getKata(response, params) {
  const competitionId = params.query.id;
  await getKataList().then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("#AppBody > div.l_apply_list > div:nth-child(2) > dl > dd")

    let isExist = "예약이 시작되지 않았습니다";
    if (!competitionId) {
      isExist = "검색하지 않음"
    }

    $bodyList.each(function(i, elem) {
      const title = $(this).find("p").text().trim();
        if (i == 82) {
          if (competitionId) {
            if (title.trim() === competitionId) {
              isExist = string.START;
            }
          }
        }
        if (title) {
          ulList.push(title + "\n");
        }
    });

    response.writeHead(200, {'Content-Type' : 'application/json'});
    response.write(
      string.CURRENT
      + ulList
      + `검색결과 : ${competitionId} ${isExist}`
    );
    response.end();
  })
  .then(res => console.log(res));
}

var handle = {}; // javascript object has key:value pair.
handle['/'] = view;
handle['/view'] = view;
handle['/create'] = create;
handle['/get/kata'] = getKata;

export default handle;