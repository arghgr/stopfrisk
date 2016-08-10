var getData = require('./getData').getData;
var getLabels = require('./getData').getLabels;

const router = require('express').Router();

router.get('/:id(\\d+)', getData);
router.get('/labels/', getLabels);

module.exports = router;
