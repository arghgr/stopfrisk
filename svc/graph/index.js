var postGraph = require('./postGraph').postGraph;
var bodyparser = require('body-parser');

const router = require('express').Router();

router.post(/\/?/, bodyparser.json(), postGraph);

module.exports = router;
