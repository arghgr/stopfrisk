var getPieGraph = require('./getGraph').getPieGraph;
var bodyparser = require('body-parser');

const router = require('express').Router();

router.get(/\/?/, bodyparser.json(), getPieGraph);

module.exports = router;
