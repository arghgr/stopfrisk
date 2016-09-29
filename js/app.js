var config = require('../common/config');
var request = require('superagent');

var DEBUG = false;

document.addEventListener('DOMContentLoaded', ()=> {

  function addFilterGroup(typeName, field, options = null) {
    if (!document.getElementById(typeName + '-' + field.variable + '-group')) {
      // Create form group
      var formGroup = document.createElement('div');
      formGroup.id = typeName + '-' + field.variable + '-group';
      formGroup.className = 'form-group';
      var label = document.createElement('label');
      label.innerHTML = field.label;
      var select = document.createElement('select');
      select.id = field.variable + 'Select'
      select.className = 'form-control';
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      document.getElementById(typeName + 'Groups').appendChild(formGroup);

      // Add options to select
      options.forEach(option => {
        var optionElem = document.createElement('option');
        optionElem.text = option.label;
        optionElem.value = option.value;
        select.appendChild(optionElem);
      });
    }
  };

  getLabels(2015)
  .then(labels => {
    var fieldsMap = {};
    labels.fields.forEach(field => {
      fieldsMap[field.variable] = field;
      // Add field to sort options
      var sortOption = document.createElement('option');
      sortOption.text = field.label;
      sortOption.value = field.variable;
      if (sortOption.value === 'race') sortOption.defaultSelected = true;
      document.getElementById('sortBy').appendChild(sortOption);

      // If field has suboptions, add field to filter options
      if (labels.fieldValues[field.variable].length > 0) {
        var filterOption = document.createElement('option');
        filterOption.text = field.label;
        filterOption.value = field.variable;
        document.getElementById('filterBy').appendChild(filterOption);
      }
    });

    var opts = [...document.getElementById('filterBy').selectedOptions].map(o=>o.value);

    // Upon change in selected filter options, add/remove suboption filters
    document.getElementById('filterBy').addEventListener('change', (ev)=> {
      var newOpts = [...document.getElementById('filterBy').selectedOptions].map(o=>o.value);

      var added = newOpts.filter(o => { return opts.indexOf(o) < 0 });
      var removed = opts.filter(o => { return newOpts.indexOf(o) < 0 });

      // Add suboptions for each newly added filter
      added.forEach(opt => {
        if (!document.getElementById('filterBy-' + opt + '-group')) {
          addFilterGroup('filterBy', fieldsMap[opt], labels.fieldValues[opt]);
          // console.log('added filterBy-' + opt + '-group');
        }
      });

      // Remove options for each newly removed filter
      removed.forEach(opt => {
        if (document.getElementById('filterBy-' + opt + '-group')) {
          document.getElementById('filterByGroups').removeChild(
            document.getElementById('filterBy-' + opt + '-group')
          );
        }
        // console.log('removed filterBy-' + opt + '-group');
      });

      opts = newOpts;
    });
  });

  resultBtn.addEventListener('click', (ev)=> {
    ev.preventDefault();

    // Get selected filters' suboptions
    var filters = {};
    var filterGroups = document.getElementById('filterByGroups').getElementsByTagName('select');
    [...filterGroups].forEach(filterGroup => {
      filters[filterGroup.id.replace('Select', '')] = filterGroup.selectedOptions[0].value;
    });

    var sortBy = document.getElementById('sortBy');
    var sort = sortBy.options[sortBy.selectedIndex].value;

    getResult(sort, filters)
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

function getSortOptions() {
  return new Promise((resolve, reject)=> {
    request
    .get('/svc/data/labels/sort/')
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

function getFilterOptions(filter, year) {
  return new Promise((resolve, reject)=> {
    request
    .get('/svc/data/labels/filter/')
    .query({ filter: filter, year: year })
    .end((err, res)=> {
      try {
        let response = res.body;
        if (DEBUG) console.log('getFilterOptions response: ', response);
        resolve(response);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};


function getLabels(year) {
  return new Promise((resolve, reject)=> {
    console.log('getLabels() req year: ', year);
    request
    .get('/svc/labels/')
    .query({ year: year })
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

function getResult(sort, filters) {
  var query = { sortBy: sort, year: 2015, filters: filters }
  return new Promise((resolve, reject)=> {
    request
    .get('/svc/data/')
    .query(query)
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
