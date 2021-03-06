const slugify = require('slugify');

module.exports = (itemLists) => {
  return itemLists.map((item) => `<a class="nav-item" href="/${slugify(item)}">${item}</a>`);
};
