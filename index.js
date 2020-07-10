// server/index.js
'use strict';

const app = require('./app');

const PORT = app.cnf.get("app.service.port") || 9000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});