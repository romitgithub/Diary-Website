var simpleInsightsDataUrl = "https://api.myjson.com/bins/7g95t";
var chartJsonData;

function loadSimpleInsightsChartData(){
	$.getJSON( simpleInsightsDataUrl, function( data ) {
	  if(data!=null){
	  	chartJsonData = data;
	  	$('.data-title').html("<strong>" + data.dataTitle + "</strong>");
	  	
	  	addCharts(data);
	  	addRelativeLengthData(data);
	  }
	});
}

function addRelativeLengthData(data){
	$('#relativeLengthItem1 > div > .data-comparison-item-title').text(data.chartComparisonItems[0]);
	$('#relativeLengthItem1 > div > .data-comparison-item-value').text(data.maleRelativeLengthEmails);
	$('#relativeLengthItem1 > div > .progress-bar').css('width', data.maleRelativeLengthEmails*100+'%').attr('aria-valuenow', data.maleRelativeLengthEmails*100);

	$('#relativeLengthItem2 > div > .data-comparison-item-title').text(data.chartComparisonItems[1]);
	$('#relativeLengthItem2 > div > .data-comparison-item-value').text(data.femaleRelativeLengthEmails);
	$('#relativeLengthItem2 > div > .progress-bar').css('width', data.femaleRelativeLengthEmails*100+'%').attr('aria-valuenow', data.femaleRelativeLengthEmails*100);
}

function addCharts(data){

	var charts = data.charts;
	$('.multiple-charts-container').empty();

	for(var i = 0; i < charts.length; i++){
		var chartId = "chart"+ i;
		var chartItemId = "chart_item_"+ i;
		var chartItem = "<div class='col-6'><div class='col-12 chart-item' id='" + chartItemId + "'></div></div>";
		var chartHeaderItem = "<h6 class='text-left chart-title'><strong>" + charts[i].chartTitle + "</strong></h6>";
		var dataComparisonContainer = "<div class='text-left data-comparison-items'></div>";
		var chart = "<div class='lg-chart mt-4' id='" + chartId + "'></div>";

		$('.multiple-charts-container').append(chartItem);
		$('#' + chartItemId).append(chartHeaderItem);
		$('#' + chartItemId).append(dataComparisonContainer);
		$('#' + chartItemId).append(chart);
		$('#' + chartItemId + ' > .data-comparison-items').append(getDataComparisonItems(data.chartComparisonItems));
	 	
	 	drawChart("#"+chartId, charts[i].chartData, 0.6);
	}
}

function getDataComparisonItems(chartComparisonItems){

	var colorsClass = ["blue", "red"];
	var items = [];

	for(var j = 0; j < chartComparisonItems.length; j++){
		var additionalClass = colorsClass[j];
		var div = "<div class='data-comparison-item text-left'><span class='data-comparison-item-title'>" + chartComparisonItems[j] + "</span><span class='data-comparison-item-icon " + additionalClass + "'></span></div>";

		items.push(div);
	}

	return items;
}