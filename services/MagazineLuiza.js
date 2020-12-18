const fetch = require("node-fetch");
const cheerio = require("cheerio");

const MagazineLuiza = {
  name: "Magazine Luiza",
  baseURL: "https://www.magazineluiza.com.br/busca",
  async getProductsByTerm(term) {
    try {
      const response = await fetch(`${this.baseURL}/${term}`);
      const body = await response.text();
      const $ = cheerio.load(body);
      const listProducts = [];
      $("ul.productShowCase li.product").each((index, element) => {
        const priceHTML = $(element).find("span.productPrice span.price").text();
        const product = {
          title: $(element).find("h3.productTitle").text(),
          price: priceHTML.replace(/\s/g, "").replace("àvista", ""),
          provider: this.name,
        };

        listProducts.push(product);
      });
      return listProducts;
    } catch (err) {
      return {
        error: true,
        status: err.status,
        details: err.message,
      };
    }
  },
};

module.exports = MagazineLuiza;
