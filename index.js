const Crawler = require('crawler');
const ObjectsToCsv = require('objects-to-csv');

const coins = [];
const replaceSpecialCharacters = (text) => text.replace(/[\n]/g, '').replace(/  +/g, ' ').trim();

const crawlerCallback = (error, res, done) => {
  console.log('Crawled url', res.options.uri);

  const $ = res.$;
  const coinRows = $('.coins .table tbody tr');
  coinRows.each((index, coinRow) => {
    const rankElement = $(coinRow).find('td:first-child .profile__rank');
    const nameElement = $(coinRow).find('td:first-child .profile__name .profile__link');
    const priceElement = $(coinRow).find('td:nth-child(2) .valuta');

    const rank = Number(replaceSpecialCharacters(rankElement.text()));
    const name = replaceSpecialCharacters(nameElement.text());
    const price = replaceSpecialCharacters(priceElement.text());

    if (rank && name && price) {
      const coinInformation = { rank: rank, name: name, price: price };
      coins.push(coinInformation);
    }
  });
  done();
};

const crawler = new Crawler({
  callback: crawlerCallback,
});

crawler.on('drain',function(){
  coins.sort((coin) => coin.rank);

  coins.forEach((coin) => console.log(coin));

  const csv = new ObjectsToCsv(coins);
  csv.toDisk('./coins.csv');
});

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].forEach(page => {
  crawler.queue(`https://coinranking.com/?page=${page}`)
});
