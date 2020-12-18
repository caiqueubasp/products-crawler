const fetch = require("node-fetch");
const cheerio = require("cheerio");

const MercadoLivre = {
  name: "Mercado Livre",
  baseURL: "https://lista.mercadolivre.com.br",
  async getProductsByTerm(term) {
    try {
      const response = await fetch(`${this.baseURL}/${term}`);
      const body = await response.text();
      const $ = cheerio.load(body);
      const listProducts = [];
      $("ol.ui-search-layout li").each((index, element) => {
        const priceHTML = $(element).find("div.ui-search-price__second-line").text();
        const product = {
          title: $(element).find("h2.ui-search-item__group--title h2").text(),
          price: priceHTML.slice(0, priceHTML.lastIndexOf("R$")),
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

module.exports = MercadoLivre;
