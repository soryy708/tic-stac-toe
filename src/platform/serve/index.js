'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const express = require('express');

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
const serveDirectoryPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'dist',
    'front',
);
const app = express();
app.use(express.static(serveDirectoryPath, {}));
app.listen(port, () => {
    console.log('Listening on port ' + port);
    console.log(`Serving files from "${serveDirectoryPath}"`);
});
