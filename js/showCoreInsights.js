var coreInsightsDataUrl = "https://api.myjson.com/bins/ek4kx";
var chartJsonData;

function loadCoreInsightsChartData(){
	$.getJSON( coreInsightsDataUrl, function( data ) {
	  if(data!=null){
	  	chartJsonData = data;
	  	$('.data-title').html("<strong>" +chartJsonData.dataTitle + "</strong>");
	  	$('.chart-title').html("<strong>" +chartJsonData.chartSections[0] + "</strong>");
	  	
	  	resetChartView();
	  	addDataComparisonItems(data.chartComparisonItems);
	  	addDataSectionButtons(data.chartSections);

	  	for(var i = 1; i <=chartJsonData.charts.length; i++){
	  		var chartId = "chart"+i;
	  		console.log(chartId);
	  		var div = "<div class='col-6 lg-chart mt-4' id='" + chartId + "'></div>";
	  		$('.charts-box').append(div);
	  		drawChart("#"+chartId,chartJsonData.charts[i-1][data.chartSections[0]], 0.6);
	  	}
	  }
	});
}

function resetChartView(){
	$('.data-section-buttons').empty();
	$('.data-comparison-items').empty();
	$('.charts-box').empty();
}

function addDataSectionButtons(chartSections){
	for(var i = 1; i <= chartSections.length; i++){
		var additionalClass = "";
		if(i == 1){
			additionalClass = "selected";
		}
		else{
			additionalClass = "unselected";	
		}

		var buttonId = "button"+(i-1);

		var button = "<button id=" + buttonId + " class='button data-section-button " + additionalClass +"' onclick='loadDataForNewType(" + (i-1) + ")'>" + chartSections[i-1] + "</button>";
		$('.data-section-buttons').append(button);
	}
}

function addDataComparisonItems(chartComparisonItems){
	var colorsClass = ["blue", "red"];

	for(var i = 1; i <= chartComparisonItems.length; i++){
		var additionalClass = colorsClass[i-1];
		var div = "<div class='data-comparison-item text-left'><span class='data-comparison-item-title'>" + chartComparisonItems[i-1] + "</span><span class='data-comparison-item-icon " + additionalClass + "'></span></div>";

		$('.data-comparison-items').append(div);
	}
}

function loadDataForNewType(chartSectionPosition){

	$('.data-section-button.selected').removeClass('selected').addClass('unselected');
	$('#button' + chartSectionPosition).removeClass('unselected').addClass('selected');

	$('.data-title').html("<strong>" + chartJsonData.dataTitle + "</strong>");
  	$('.chart-title').html("<strong>" + chartJsonData.chartSections[chartSectionPosition] + "</strong>");
  	$('.charts-box').empty();
  	for(var i = 1; i <= chartJsonData.charts.length; i++){
  		var chartId = "chart"+i;
  		var div = "<div class='col-6 lg-chart mt-4' id='" + chartId + "'></div>";
  		$('.charts-box').append(div);
  		drawChart("#"+chartId, chartJsonData.charts[i-1][chartJsonData.chartSections[chartSectionPosition]], 0.6);
  	}
}