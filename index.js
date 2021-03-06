const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const generateNavItems = require('./src/module/generateNavItems');
const replaceModule = require('./src/module/replaceModule');

// variables
const dummyData = require('./dummyData/dummyData.json');

// IO
// templates
let templateOverview = fs.readFileSync(
  `${__dirname}/src/template/template-home.html`,
  'utf-8'
);
templateOverview = replaceModule(
  templateOverview,
  '{%NAV_ITEMS%}',
  generateNavItems(dummyData.navItems).join('')
);
const overview = fs.readFileSync(
  `${__dirname}/src/template/overview.html`,
  'utf-8'
);
const articles = fs.readFileSync(
  `${__dirname}/src/template/article.html`,
  'utf-8'
);
const archive = fs.readFileSync(
  `${__dirname}/src/template/archive.html`,
  'utf-8'
);
const timeline = fs.readFileSync(
  `${__dirname}/src/template/timeline.html`,
  'utf-8'
);
const aboutMe = fs.readFileSync(
  `${__dirname}/src/template/about-me.html`,
  'utf-8'
);
const project = fs.readFileSync(
  `${__dirname}/src/template/project.html`,
  'utf-8'
);

const server = http.createServer((req, res) => {
  const baseUrl = `http://${req.headers.host}/'`;
  const { pathname } = new URL(req.url, baseUrl);

  // use condition for router as for now
  if (pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(replaceModule(templateOverview, '{%MAIN_CONTENT%}', overview));
  }
  // atricle page
  else if (pathname === '/article') {
    const articleList = dummyData.recentArticles;
    const renderArticle = Object.keys(articleList)
      .map((article) => {
        const { preview, createdOn } = articleList[article];
        return `<article>
              <header>
                ${article}
              </header>
              <div>
                <div>${createdOn}</div>
                <p>${preview.substring(0, 100)}...</p>
              </div>
            </article>`;
      })
      .join('');

    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(
      replaceModule(
        templateOverview,
        '{%MAIN_CONTENT%}',
        replaceModule(articles, '{%ARTICLES%}', renderArticle)
      )
    );
  }
  // archive
  // TODO
  // the idea is to create a expandable timeline for the article, follow by the structure:
  // |- year
  // |  |- month
  // |      | - article
  // sorted by time
  else if (pathname === '/archive') {
    const articleKeys = Object.keys(dummyData.recentArticles);
    if (articleKeys.length > 0) {
    } else {
      res.end(replaceModule(templateOverview, '{%MAIN_CONTENT%}', archive));
    }
  }
  // project
  // TODO
  else if (pathname === '/project') {
    res.end(replaceModule(templateOverview, '{%MAIN_CONTENT%}', project));
  }
  // timeline
  // TODO
  else if (pathname === '/timeline') {
    res.end(replaceModule(templateOverview, '{%MAIN_CONTENT%}', timeline));
  }
  // about me page has issues with space
  // TODO
  else if (pathname === '/about-me') {
    res.end(replaceModule(templateOverview, '{%MAIN_CONTENT%}', aboutMe));
  }
  // not found page
  else {
    res.end('Page Not Found');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('server has started!');
});
