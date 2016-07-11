var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');

exports.graphMaker = (res, pieData, outputLocation)=> {
  console.log('graphMaker() pieData: ', pieData);
  console.log('graphMaker() outputLocation: ', outputLocation);

  if(!pieData) pieData = [12,31];
  if(!outputLocation) outputLocation = 'generated/test.svg';
  jsdom.env({
    html:'',
    features:{ QuerySelector:true }, //you need query selector for D3 to work
    done:function(errors, window){
      window.d3 = d3.select(window.document); //get d3 into the dom

      var svgContainer = window.d3.select("body").append("svg")
        .attr("width", 200)
        .attr("height", 200);
      //Draw the Circle
      var circle = svgContainer.append("circle")
        .attr("cx", 30)
        .attr("cy", 30)
        .attr("r", 20)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

      //write out the children of the container div
      var graph = window.d3.select('body').html();
      fs.writeFileSync(outputLocation, graph) //using sync to keep the code simple
      res.writeHead(200, {'Content-Type': 'image/svg'});
      res.end(graph);
    }
  });
}
