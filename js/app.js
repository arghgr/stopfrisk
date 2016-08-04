var request = require('superagent');

document.addEventListener('DOMContentLoaded', ()=> {
  console.log('working');

  resultBtn.addEventListener('click', (ev)=> {
    ev.preventDefault();
    console.log('resultBtn clicked');
    getResult(document.getElementById('paramId').value)
    .then(result => {
      console.log('getResult() result: ', result);
      document.getElementById('resultDiv').innerHTML = JSON.stringify(result);
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
        console.log('response: ', response);
        resolve(response);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};
