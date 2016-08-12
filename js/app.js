var request = require('superagent');


document.addEventListener('DOMContentLoaded', ()=> {
  getLabels()
  .then(labels => {
    Object.keys(labels).forEach(key => {
      var option = document.createElement('option');
      option.text = key + ': ' + labels[key];
      option.value = key;
      document.getElementById('paramId').appendChild(option);
    });
  });

  resultBtn.addEventListener('click', (ev)=> {
    ev.preventDefault();
    getResult(document.getElementById('paramId').value)
    .then(result => {
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

function getLabels() {
  return new Promise((resolve, reject)=> {
    request
    .get('/svc/data/labels/')
    .end((err, res)=> {
      try {
        let response = res.body;
        resolve(response);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};

function getResult(paramId) {
  return new Promise((resolve, reject)=> {
    request
    .get('/svc/data/')
    .query({ sortBy: 'race', year: 2015, filters: { 'detailCM': 85, 'arstmade': 'N' } })
    .end((err, res)=> {
      try {
        let response = res.body;
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
