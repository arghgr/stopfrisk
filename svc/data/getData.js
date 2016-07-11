var err = require('../utils').err;

exports.getData = (req, res, next)=> {
  try {
    var id = req.params.id;
    res.status(200).json({
      yes: id
    });
  } catch (e) {
    console.log(e);
    next(err(500), 'Error for id ' + id + ': ' + e, null);
  }
}
