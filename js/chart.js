function drawChart(chartClassName, data, spacing){

    var div = d3.select("body").append("div")
    .attr("class", "custom-tooltip text-center")
    .style("opacity", 0);

    var divWidth = $(chartClassName).width();
    var divHeight = $(chartClassName).height();

    if(divHeight==undefined || divHeight==0){
      divHeight = 300;
    }

    var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = divWidth - margin.left - margin.right,
    height = divHeight - margin.top - margin.bottom;

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
        .on("click", function(d) {
           div.transition()
             .duration(200)
             .style("opacity", 1);
           div.html(
            "<p><strong>Politeness Received</strong></p><div><span class='data-comparison-item-icon blue'></span><span class='data-comparison-item-percent'><strong>73%</strong></span><span class='data-comparison-item-group'>Male</span></div><div><span class='data-comparison-item-icon red'></span><span class='data-comparison-item-percent'><strong>63%</strong></span><span class='data-comparison-item-group'>Female</span></div>"
            )
             .style("left", (d3.event.pageX - 80) + "px")
             .style("top", (d3.event.pageY - 100) + "px");
           })
         .on("mouseout", function(d) {
           div.transition()
             .duration(500)
             .style("opacity", 0);
           })
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
        .attr("width", 14)
        .attr("x", function(d) 
        { 
          if(d.name=='Female'){
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

}

function modifyData(data, elems){
  var finalData = [];
  var count = getCount(data[0]);
  for(var i = 0; i < data.length; i++){
      for(var key in data[i]){
        if(elems[key] >= 0){
          if(i == 0){
            finalData[elems[key]] = [{ 'x': i, 'y': data[i][key]}];
          }
          else{
            finalData[elems[key]].push({ 'x': i, 'y': data[i][key]});
          }
        }
      }
  }
  return finalData;
}

function getCount(json){
  var i = 0;
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
        i++;
    }
  }
  return i;
}
 
function drawMultiLineChart(chartClassName, data, elems){

  var data = modifyData(data, elems);

  var divWidth = $(chartClassName).width();
  var divHeight = $(chartClassName).height();

  if(divHeight==undefined || divHeight==0){
    divHeight = 300;
  }

  var colors = [
    "#2590f4", "#F54040",
    "#2590f4", "#F54040"
  ]
   
   
  //************************************************************
  // Create Margins and Axis and hook our zoom function
  //************************************************************
  var margin = {top: 20, right: 10, bottom: 30, left: 15},
      width = divWidth - margin.left - margin.right,
      height = divHeight - margin.top - margin.bottom;
    
  var x = d3.scale.linear()
      .domain([0, data[0].length-1])
      .range([0, width]);
   
  var y = d3.scale.linear()
      .domain([-1, 16])
      .range([height, 0]);
    
  var xAxis = d3.svg.axis()
      .scale(x)
    .tickSize(-height)
    .tickPadding(10)  
    .tickSubdivide(true)  
      .orient("bottom");  
    
  var yAxis = d3.svg.axis()
      .scale(y)
    .tickPadding(10)
    .tickSize(-width)
    .tickSubdivide(true)  
      .orient("left");
  
    
  //************************************************************
  // Generate our SVG object
  //************************************************************  
  var svg = d3.select(chartClassName).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
   
  svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", (-margin.left) + 10)
    .attr("x", -height/2);  
   
  svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);
    
    
  //************************************************************
  // Create D3 line object and draw data on our SVG object
  //************************************************************
  var line = d3.svg.line()
      .interpolate("linear")  
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });   

  svg.selectAll('.line')
    .data(data)
    .enter()
    .append("path")
      .attr("class", "line")
    .attr("clip-path", "url(#clip)")
    .attr("stroke-width", 6)
    .attr('stroke', function(d,i){      
      return colors[i%colors.length];
    })
    .style("stroke-dasharray", function(d,i){      
      if(i%colors.length == 2 || i%colors.length == 3){
        return "3";
      }
      else{
        return "0";
      }
    })
      .attr("d", line); 
}

