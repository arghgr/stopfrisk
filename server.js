var express = require('express');
var svc = require('./svc');
const app = express();

app.use('/svc', svc);
app.use(express.static('public'));

app.listen(8080, ()=> console.log('Listening on port 8080.'));
module.exports = app;
