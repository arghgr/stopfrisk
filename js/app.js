var request = require('superagent');

document.addEventListener('DOMContentLoaded', ()=> {
  resultBtn.addEventListener('click', (ev)=> {
    ev.preventDefault();
    getResult(document.getElementById('paramId').value)
    .then(result => {
      document.getElementById('resultDiv').innerHTML = JSON.stringify(result);
      return getGraphData(result);
    })
    .then(graphData => {
      document.getElementById('resultGraphDiv').innerHTML = JSON.parse(JSON.stringify(graphData));
    })
    .catch(error => {
      console.log('error: ', error);
    });
  });
});

function getResult(paramId) {
  return new Promise((resolve, reject)=> {
    request
    .get('/svc/data/' + paramId)
    .end((err, res)=> {
      try {
        let response = res.body;
        console.log('getResult() response: ', response);
        resolve(response);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};

function getGraphData(data) {
  return new Promise((resolve, reject)=> {
    request
    .get('/svc/graph/')
    .query(data)
    .end((err, res)=> {
      try {
        let response = res;
        resolve(response.text);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};
