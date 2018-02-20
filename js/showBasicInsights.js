var basicInsightsDataUrl = "https://api.myjson.com/bins/vv0yp";
var chartJsonData;
var chartsMainContainerClassName = '.charts-main-container';
var dataComparisonItemsClassName = '.data-comparison-items';

function loadBasicInsightsChartData(){
	$.getJSON( basicInsightsDataUrl, function( data ) {
	  if(data!=null){
	  	chartJsonData = data;

	  	$('.data-title').html("<strong>" + data.dataTitle + "</strong>");
	  	if(data.charts.length!=0){
	  		resetChartView();
	  		for(var i = 0; i < data.charts.length; i++){
	  			if(data.charts[i].chartType == "SingleBarChartContainer"){
	  				addSingleBarChartContainer(data.charts[i], i+1);
	  			}
	  			else if(data.charts[i].chartType == "SingleLineChartContainer"){
	  				addSingleLineChartContainer(data.charts[i], i+1);
	  			}
	  			else if(data.charts[i].chartType == "MultipleBarChartContainer"){
	  				addMultipleBarChartContainer(data.charts[i], i+1);
	  			}
	  			else if(data.charts[i].chartType == "MultipleLineChartContainer"){
	  				addMultipleLineChartContainer(data.charts[i], i+1);
	  			}
	  		}
	  	}
	  }
	});
}

function addSingleBarChartContainer(data, position){
	var chartContainerId = "chart_container_" + position;
	var chartContainer = "<div class='container col-12 single-chart-container mt-4' id='" + chartContainerId + "'></div>";
	var chartHeaderItem = "<h5 class='col-12 text-left chart-title'><strong>" + data.chartTitle + "</strong></h5>";
	var chartComparisonItemsContainer = "<div class='col-12 text-left data-comparison-items'>";
	var chartBox = "<div class='row chart-box'></div>";

	$(chartsMainContainerClassName).append(chartContainer);
	$('#' + chartContainerId).append(chartHeaderItem);
	$('#' + chartContainerId).append(chartComparisonItemsContainer);
	$('#' + chartContainerId).append(chartBox);
	$('#' + chartContainerId + ' > ' + dataComparisonItemsClassName).append(getDataComparisonItems());

	for(var j = 0; j < data.chartData.length; j++){
		var chartItemId  = chartContainerId + "_chart_" + j;
		var chartItem = "<div class='col-3 md-chart mt-4' id='" + chartItemId + "'></div>";
		$('#' + chartContainerId + ' > ' + '.chart-box').append(chartItem);

		drawChart("#"+chartItemId, data.chartData[j], 0.6);
	}

}

function addSingleLineChartContainer(data, position){
	var chartContainerId = "chart_container_" + position;
	var chartContainer = "<div class='container col-12 single-chart-container mt-4' id='" + chartContainerId + "'></div>";
	var chartHeaderItem = "<h5 class='col-12 text-left chart-title'><strong>" + data.chartTitle + "</strong></h5>";
	var chartComparisonItemsContainer = "<div class='col-12 text-left data-comparison-items'></div>";
	var chartBox = "<div class='row chart-box'></div>";

	$(chartsMainContainerClassName).append(chartContainer);
	$('#' + chartContainerId).append(chartHeaderItem);
	$('#' + chartContainerId).append(chartComparisonItemsContainer);
	$('#' + chartContainerId).append(chartBox);
	$('#' + chartContainerId + ' > ' + dataComparisonItemsClassName).append(getDataComparisonItems());

	var chartItemId  = chartContainerId + "_chart";
	var chartItem = "<div class='col-12 md-chart mt-4' id='" + chartItemId + "'></div>";
	$('#' + chartContainerId + ' > ' + '.chart-box').append(chartItem);

	drawMultiLineChart("#"+chartItemId, data.chartData, data.chartElems, 0, false);
}

function addMultipleBarChartContainer(data, position){
	var chartContainerId = "chart_container_" + position;
	var chartContainer = "<div class='row multiple-charts-container mt-4' id='" + chartContainerId + "'></div>";

	$(chartsMainContainerClassName).append(chartContainer);
	
	for(var i = 0; i < data.charts.length; i++){
		var chartItemContainerId  = chartContainerId + "_chart_item_container_" + i;
		var chartItemContainer = "<div class='col-6'><div class='col-12 chart-item' id='" + chartItemContainerId + "'></div></div>";

		var chartHeaderItem = "<h5 class='col-12 text-left chart-title'><strong>" + data.charts[i].chartTitle + "</strong></h5>";
		var chartComparisonItemsContainer = "<div class='col-12 text-left data-comparison-items'></div>";	

		var chartId = chartItemContainerId + "_chart";
		var chart = "<div class='rg-chart mt-4' id='" + chartId + "''></div>";

		$('#' + chartContainerId).append(chartItemContainer);
		$('#' + chartItemContainerId).append(chartHeaderItem);
		$('#' + chartItemContainerId).append(chartComparisonItemsContainer);
		$('#' + chartItemContainerId + ' > ' + dataComparisonItemsClassName).append(getDataComparisonItems());
		$('#' + chartItemContainerId).append(chart);
		drawChart('#'+chartId, data.charts[i].chartData, 0.6);
	}			
}

function addMultipleLineChartContainer(data, position){
	var chartContainerId = "chart_container_" + position;
	var chartContainer = "<div class='row multiple-charts-container mt-4' id='" + chartContainerId + "'></div>";

	$(chartsMainContainerClassName).append(chartContainer);
	
	for(var i = 0; i < data.charts.length; i++){
		var chartItemContainerId  = chartContainerId + "_chart_item_container_" + i;
		var chartItemContainer = "<div class='col-6'><div class='col-12 chart-item' id='" + chartItemContainerId + "'></div></div>";

		var chartHeaderItem = "<h5 class='col-12 text-left chart-title'><strong>" + data.charts[i].chartTitle + "</strong></h5>";
		var chartComparisonItemsContainer = "<div class='col-12 text-left data-comparison-items'></div>";	

		var chartId = chartItemContainerId + "_chart";
		var chart = "<div class='sm-chart mt-4' id='" + chartId + "''></div>";

		$('#' + chartContainerId).append(chartItemContainer);
		$('#' + chartItemContainerId).append(chartHeaderItem);
		$('#' + chartItemContainerId).append(chartComparisonItemsContainer);
		$('#' + chartItemContainerId + ' > ' + dataComparisonItemsClassName).append(getDataComparisonItems());
		$('#' + chartItemContainerId).append(chart);
		drawMultiLineChart('#'+chartId, data.charts[i].chartData, data.charts[i].chartElems, 0, false);
	}
}	

function resetChartView(){
	$(chartsMainContainerClassName).empty();
}	

function getDataComparisonItems(){
	var chartComparisonItems = chartJsonData.chartComparisonItems;
	var colorsClass = ["blue", "red"];
	var items = [];

	for(var j = 0; j < chartComparisonItems.length; j++){
		var additionalClass = colorsClass[j];
		var div = "<div class='data-comparison-item text-left'><span class='data-comparison-item-title'>" + chartComparisonItems[j] + "</span><span class='data-comparison-item-icon " + additionalClass + "'></span></div>";

		items.push(div);
	}

	return items;
}