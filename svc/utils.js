function err(c, m, b) {
  return {code: c, message: m, body: b}
}

function handleError(err, req, res, next) {
  if (err) {
    console.error('Error handling query: ' + req.path);
    console.error(err.message);
    res.statusMessage = err.message;
    res.status(err.code || 500).json(err.body);
  }
  next();
}

exports.err = err;
exports.handleError = handleError;
