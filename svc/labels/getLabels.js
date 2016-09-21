var err = require('../utils').err;
var readCsv = require('../utils').readCsv;

exports.getLabels = (req, res, next)=> {
  var fields = {};
  var fieldValues = {};
  try {
    var year = req.query.year;
    readCsv(year + 'labels_field.csv')
    .then(fieldCsv => {
      fields = fieldCsv;
      return readCsv(year + 'labels_value.csv');
    })
    .then(values => {
      fields.forEach(field => {
        fieldValues[field.variable] = values.filter(value => {
          if (value.field === field.variable) return value;
        });
      });
      res.send({ fields: fields, fieldValues: fieldValues });
    })
    .catch(error => { throw error; });
  } catch (e) {
    next(err(500), 'Error: ' + e, null);
  }
};
