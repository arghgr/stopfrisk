var fs = require('fs');
var parse = require('csv-parse');

exports.err = (c, m, b)=> {
  return {code: c, message: m, body: b}
};

exports.handleError = (err, req, res, next)=> {
  if (err) {
    console.error('Error handling query: ' + req.path);
    console.error(err.message);
    res.statusMessage = err.message;
    res.status(err.code || 500).json(err.body);
  }
  next();
};

exports.readCsv = (fileName)=> {
  return new Promise((resolve, reject)=> {
    try {
      var file =  __dirname + '/labels/' + fileName;
      var parser = parse({ columns: true, delimiter: ',' }, (err, data)=> {
        if (err) throw err;
        resolve(data);
      });
      var input = fs.createReadStream(file);
      input.pipe(parser);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};
