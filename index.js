const http = require("http");
// const { url } = require("inspector");
const MercadoLivre = require("./services/MercadoLivre");
const MagazineLuiza = require("./services/MagazineLuiza");
const Cache = require("./utils/Cache");

const app = http.createServer(async (req, res) => {
  const term = req.url.replace("/", "");

  if (term.length < 1) {
    res.writeHead(400, { "Content-type": "application/json; charset=utf-8" }),
      res.write(JSON.stringify("O Termo de busca não foi informado")),
      res.end();
  }

  const cachedProducts = Cache.getCache(term);

  if (cachedProducts) {
    res.writeHead(200, { "Content-type": "application/json; charset=utf-8" });
    res.write(JSON.stringify(cachedProducts));
    return res.end();
  }

  // const products = await MercadoLivre.getProductsByTerm(term);
  const products = await MagazineLuiza.getProductsByTerm(term);

  console.log(term, products);

  if (products.error) {
    res.writeHead(503, { "Content-type": "application/json; charset=utf-8" });
    res.write(JSON.stringify(products.details));
    return res.end();
  }

  // Cache.setCache(term, JSON.stringify(products));

  res.writeHead(200, { "Content-type": "application/json; charset=utf-8" });

  // res.write(JSON.stringify("Servidor rodando"));
  res.write(JSON.stringify(products));
  res.end();
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});
