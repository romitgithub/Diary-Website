/*
** Method to draw stacked bar chart 
** @param chartDivIdentifier: id/class name of the div inside which the chart is drawn
** @param data: dataset for drawing the chart
** @param spacing: spacing is the space between different bar groups
** sampleData can be found in json/coreInsights.json file
**
*/ 
function drawChart(chartDivIdentifier, data, spacing){

    // tooltip div
    var div = d3.select("body").append("div")
    .attr("class", "custom-tooltip text-center")
    .style("opacity", 0);

    // colors array for multiple bars
    var color = d3.scale.ordinal()
        .range(["#2590f4", "#F54040"]);

    // gets the container div's width and height to calculate svg dimensions
    var divWidth = $(chartDivIdentifier).width();
    var divHeight = $(chartDivIdentifier).height();

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

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom")
        .outerTickSize(spacing);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select(chartDivIdentifier).append("svg")
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
 
/*
** Method to draw multiple line chart 
** @param chartDivIdentifier: id/class name of the div inside which the chart is drawn
** @param data: dataset for drawing the chart
** @param elems: this is related to the data, which can be found in json/basicInsights.json
** @param numAxisLabels: number of x axis labels to show
** @param showDots: boolean to enable.disable showing of dots on line chart
** sample data can be found at json/basicInsights.json, under chartTypes = SingleLineChartContainer, MultipleLineChartContainer
*/ 
function drawMultiLineChart(chartDivIdentifier, data, elems, numAxisLabels, showDots, showToolTip2){

  var data = modifyData(data, elems);
  console.log(data);
  var labelsArray = data['labelsArray'];

  var divWidth = $(chartDivIdentifier).width();
  var divHeight = $(chartDivIdentifier).height();

  if(divHeight==undefined || divHeight==0){
    divHeight = 300;
  }

  var tooltip, tooltipOffset, tooltipExtraHeightOffset;

  if(showToolTip2){
    tooltip = d3.select("body")
            .append("div")
            .attr("class", "line-chart-tooltip justify-content-center")
            .style("opacity", 0);

    tooltip.html("<div class='line-chart-tooltip-item-block'><div class='line-chart-tooltip-item'><p>78%</p><p><strong>Politeness</strong></p></div><div class='line-chart-tooltip-item'><p>12%</p><p><strong>Request</strong></p></div><div class='line-chart-tooltip-item'><p>1.8</p><p><strong>Balance</strong></p></div></div><div class='line-chart-tooltip-item-block'><div class='line-chart-tooltip-item'><p>56%</p><p><strong>Positive</strong></p></div><div class='line-chart-tooltip-item'><p>74%</p><p><strong>Negative</strong></p></div></div><div class='line-chart-tooltip-item-block'><div class='line-chart-tooltip-item'><p>59%</p><p><strong>Mirroring</strong></p></div></div>");

    tooltipOffset = 300;
    tooltipExtraHeightOffset = 20;
  }
  else{
    tooltip = d3.select("body")
            .append("div")
            .attr("class", "custom-tooltip text-center")
            .style("opacity", 0);
    
    tooltip.html("<p><strong>Politeness Received</strong></p><div><span class='data-comparison-item-icon blue'></span><span class='data-comparison-item-percent'><strong>73%</strong></span><span class='data-comparison-item-group'>Male</span></div><div><span class='data-comparison-item-icon red'></span><span class='data-comparison-item-percent'><strong>63%</strong></span><span class='data-comparison-item-group'>Female</span></div>");

    tooltipOffset = 80;
    tooltipExtraHeightOffset = 0;
  }

  var colors = [
    "#2590f4", "#F54040",
    "#2590f4", "#F54040"
  ]
   
  var ticksCount = labelsArray.length;
  if(numAxisLabels!=0){
    ticksCount = numAxisLabels;
  }
   
  //************************************************************
  // Create Margins and Axis and hook our zoom function
  //************************************************************
  var margin = {top: 20, right: 30, bottom: 30, left: 30},
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
      .ticks(ticksCount)
      .tickSize(-height)
      .tickPadding(5)  
      .tickFormat(function(d, i){
          return labelsArray[i%(labelsArray.length)] //"Jan Feb, etc depending on the tick value - 0,1,2,3,4"
      })
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
  var svg = d3.select(chartDivIdentifier).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
   
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
    .attr("stroke-width", 12)
    .attr('stroke', function(d,i){      
      return colors[i%colors.length];
    })
    .on("click", function(d) {

       tooltip.style("z-index", 1);

       tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
       
       tooltip
          .style("left", (d3.event.pageX - tooltipOffset + "px"))
          .style("top", (d3.event.pageY - 100 - tooltipExtraHeightOffset) + "px");
    })
    .on("mouseout", function(d) {
       tooltip
          .transition()
          .duration(500)
          .style("opacity", 0)
          .style("z-index", -10);
    })
    .style("stroke-dasharray", function(d,i){      
      if(i%colors.length == 2 || i%colors.length == 3){
        return "3";
      }
      else{
        return "0";
      }
    })
    .style("stroke-width", 3)
    .attr("d", line); 

  if(showDots){
    var points = svg.selectAll('.dots')
    .data(data)
    .enter()
    .append("g")
    .attr("class", "dots"); 
   
    points.selectAll('.dot')
      .data(function(d, index){     
        var a = [];
        d.forEach(function(point,i){
          a.push({'index': index, 'point': point});
        });   
        return a;
      })
      .enter()
      .append('circle')
      .attr('class','dot')
      .attr("r", 4)
      .attr('fill', function(d,i){  
        return colors[d.index%colors.length];
      })  
      .attr("transform", function(d) { 
        return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
      )
      .on("click", function(d) {

         tooltip.style("z-index", 1);

         tooltip
            .transition()
            .duration(200)
            .style("opacity", 1);
         
         tooltip
            .style("left", (d3.event.pageX - tooltipOffset + "px"))
            .style("top", (d3.event.pageY - 100 - tooltipExtraHeightOffset) + "px");
      })
      .on("mouseout", function(d) {
         tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)
            .style("z-index", -10);
      });
    }
}

/*  
**  Helper methods to format the data to suit the chart drawing methods
**  This methods are only used for the MultipleLineChart draw method
*/

function modifyData(data, elems){
  var finalData = [];
  finalData['labelsArray'] = [];
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
        else{
          finalData['labelsArray'].push(data[i][key]);
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


