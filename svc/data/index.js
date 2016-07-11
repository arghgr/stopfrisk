var getData = require('./getData').getData;

const router = require('express').Router();

router.get('/:id(\\d+)', getData);

module.exports = router;
