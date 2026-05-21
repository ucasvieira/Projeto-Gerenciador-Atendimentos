const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

// O parâmetro 'static' aponta para a pasta gerada pelo build do Vite
const middlewares = jsonServer.defaults({ static: './dist' });

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});