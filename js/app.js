var request = require('superagent');

document.addEventListener('DOMContentLoaded', ()=> {
  console.log('working');

  resultBtn.addEventListener('click', ()=> {
    console.log('resultBtn clicked');
    getResult()
    .then(result => {
      console.log('getResult() result: ', result);
      document.getElementById('resultDiv').innerHTML = JSON.stringify(result);
    });
  });
});

function getResult() {
  return new Promise((resolve, reject)=> {
    var id = 85;
    request
    .get('svc/data/' + id)
    .send()
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
