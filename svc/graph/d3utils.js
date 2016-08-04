var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');

exports.generatePieGraph = (res, data, fileName)=> {

  if (!fileName) fileName = 'test';
  fileName = 'generated/' + fileName + '.svg';

  if (!data) data = [
    { "name": "B", "number": 1856 },
    { "name": "Q", "number": 677 },
    { "name": "A", "number": 255 },
    { "name": "W", "number": 203 },
    { "name": "P", "number": 200 },
    { "name": "Z", "number": 58 },
    { "name": "I", "number": 19 },
    { "name": "U", "number": 9 }
  ];

  jsdom.env({
    html:'',
    features: { QuerySelector: true }, // Need query selector for D3 to work
    done: (errors, window)=> {
      window.d3 = d3.select(window.document); // Get D3 into the dom

      var arcs = d3.pie().value((d)=> { return d.number; })(data); // Turn data into pie drawing data

      var width = 500,
          height = 500,
          radius = Math.min(width, height) / 2;

      // Declare graph colors
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      // Declare arc size
      var arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

      // Declare arc label position
      var labelArc = d3.arc()
          .outerRadius(radius - 40)
          .innerRadius(radius - 40);

      // Create SVG
      var svg = window.d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      // Add pie arcs to SVG
      var g = svg.selectAll(".arc")
          .data(arcs)
        .enter().append("g")
          .attr("class", "arc");
      g.append("path")
          .attr("d", arc)
          .style('fill', (d)=> { return color(d.data.number); });
      g.append("text")
          .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .text((d)=> { return d.data.name + ': ' + d.data.number });

      // Select SVG's resulting HTML
      var html = window.d3.select("svg")
        .attr("title", fileName)
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

      // Send SVG with response
      fs.writeFileSync(fileName, html)
      res.writeHead(200, {'Content-Type': 'image/svg+xml'});
      res.end(html);
    }
  });
}
