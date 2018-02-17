var data1 = [
  {
    "Groups": "Politeness",
    "Level 1": 4,
    "Level 2": 6
  },
  {
    "Groups": "Request",
    "Level 1": 3,
    "Level 2": 4
  },
  {
    "Groups": "Balance",
    "Level 1": 6,
    "Level 2": 4
  }
]

var data2 = [
  {
    "Groups": "Politeness",
    "Level 1": 4,
    "Level 2": 6
  },
  {
    "Groups": "Request",
    "Level 1": 2,
    "Level 2": 4
  },
  {
    "Groups": "Balance",
    "Level 1": 6,
    "Level 2": 4
  }
]

drawChart(".chart-1", data1, 0.6);
drawChart(".chart-2", data2, 0.7);

function drawChart(chartClassName, data, spacing){

    var divWidth = $(chartClassName).width();

    var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = divWidth - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], spacing);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#2590f4", "#F54040"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom")
        .outerTickSize(spacing);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select(chartClassName).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Groups"; });

    data.forEach(function(d) {
        d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
        });

    x0.domain(data.map(function(d) { return d.Groups; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var state = svg.selectAll(".groups")
        .data(data)
        .enter().append("g")
        .attr("class", "groups")
        .attr("transform", function(d) { return "translate(" + x0(d.Groups) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
        .enter().append("rect")
        .attr("width", Math.min(x1.rangeBand()-2, 16))
        .attr("x", function(d) 
        { 
          if(d.name=='Level 2'){
            return x1(d.name) + 5;   
          }
          else{
            return x1(d.name); 
          }
          
        })
        .attr("y", function(d) { return y(d.value); })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    // var legend = svg.selectAll(".legend")
    //     .data(ageNames.slice().reverse())
    //     .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // legend.append("rect")
    //     .attr("x", width - 18)
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill", color);

    // legend.append("text")
    //     .attr("x", width - 24)
    //     .attr("y", 9)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "end")
    //     .text(function(d) { return d; });
}