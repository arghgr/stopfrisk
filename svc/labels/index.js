var getLabels = require('./getLabels').getLabels;
var bodyparser = require('body-parser');

const router = require('express').Router();

router.get(/\/?/, getLabels);

module.exports = router;
