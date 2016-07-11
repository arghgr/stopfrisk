var getGraph = require('./getGraph').getGraph;
var bodyparser = require('body-parser');

const router = require('express').Router();

router.get(/\/?/, bodyparser.json(), getGraph);

module.exports = router;
