const { response } = require('express');
const express = require('express');
const path = require('path');
const utils = require('./utils');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// fn to create express server
const create = async () => {
  // server
  const app = express();
  app.use(utils.ignoreFavicon);

  // Log request
  app.use(utils.appLogger);
  // root route - serve static file
  app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/client.html'));
  });

  app.get('/muzic.mp3', (req, res) => {
    return res.sendFile(
      path.join(__dirname, '../audio/muzic.mp3')
    );
  });
  // Catch errors
  app.use(utils.logErrors);
  app.use(utils.clientErrorHandler);
  app.use(utils.errorHandler);

  app.post('/demo', (req, res, next) => {
    const url = `http://localhost:3000/muzic.mp3`;

    fetch(url,{headers:{"Content-Type": "audio/mpeg"}})
      .then(response=>
        {
        const filename = 'muzic.mp3';
        const contentType = 'audio/mpeg'
        res.set('Content-disposition', `attachment; filename*=${filename}`);
        res.set('Content-Type', contentType);
        response.body.pipe(res)
        ;})
      .catch((e) => {
        console.log(e);
      });

    res.status(200);
  });
  return app;
};

module.exports = {
  create,
};
