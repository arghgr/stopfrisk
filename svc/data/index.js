var bodyparser = require('body-parser');
var getData = require('./getData').getData;
var getSortOptions = require('./getData').getSortOptions;
var getFilterOptions = require('./getData').getFilterOptions;

const router = require('express').Router();

router.get('/labels/sort/', getSortOptions);
router.get('/labels/filter/', bodyparser.json(), getFilterOptions);
router.get('/', bodyparser.json(), getData);

module.exports = router;
