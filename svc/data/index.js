var bodyparser = require('body-parser');
var getData = require('./getData').getData;
var getLabels = require('./getData').getLabels;

const router = require('express').Router();

router.get('/', bodyparser.json(), getData);
router.get('/labels/', getLabels);

module.exports = router;
