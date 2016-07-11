var data = require('./data');
var graph = require('./graph');
var utils = require('./utils');

const router = require('express').Router();

router.use('/data', data);
router.use('/graph', graph);
router.use(utils.handleError);
module.exports = router;
