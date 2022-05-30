const http = require('http');
const app = require('./app');
const mongoConnect = require('./services/mongo');
require('./services/passport');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();
