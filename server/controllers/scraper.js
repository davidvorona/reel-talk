const cheerio = require('cheerio');
const request = require('request');

const scraperController = {};

scraperController.links = [];

scraperController.getLinks = (req, res, next) => {
  const options = {
    url: 'http://www.metacritic.com/browse/movies/release-date/theaters/date',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
    }
  };
  let link;
  request(options, (error, response, html) => {
    const $ = cheerio.load(html);
    if (error) throw error;
    $('.product_title a').each(function () {
      link = 'http://www.metacritic.com' + ($(this).attr('href'));
      scraperController.links.push(link);
    });
    next();
  });
};

scraperController.getData = (req, res, next) => {
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
    }
  };
  const movies = [];
  const movie = {};
  const recursiveRequest = (links, length) => {
    if (length === 0) {
      req.movies = movies;
      next();
      return;
    }
    options.url = links[0];
    movie.link = links[0];
    movie.title_id = movie.link.split('').splice(32).join('');
    request(options, (error, response, html) => {
      const $ = cheerio.load(html);
      if (error) throw error;
      let count = 0;
      $('.metascore_anchor').each(function () {
        count += 1;
        if (count === 1) movie.critic = $(this).text().trim();
        else if (count === 2) movie.user = $(this).text().trim();
        else return;
      });
      movie.title = $('.product_title').first().text().trim();
      movies.push(JSON.parse(JSON.stringify(movie)));
      scraperController.links.shift();
      return recursiveRequest(scraperController.links, scraperController.links.length);
    });
  };
  recursiveRequest(scraperController.links, scraperController.links.length);
};

module.exports = scraperController;
