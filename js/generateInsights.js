var generateInsightsUrl = "https://api.myjson.com/bins/1fqpmh";
var jsonData;

function loadGenerateInsightFormData(loadInitialData, selectedDataPosition){
	$.getJSON( generateInsightsUrl, function( data ) {
	  if(data!=null){
	  	jsonData = data;
	  	addGroupsData(data.groups, "group_a");
	  	addGroupsData(data.groups, "group_b");
	  	addDropdownGroupData(data.groups, "group_dropdown_container");
	  	addTimePeriodData(data.timePeriods, "time_period_group");
	  	addFavoritesDropdownData(data.favorites, "favorites_dropdown_container");
	  	if(loadInitialData){
	  		updateView(selectedDataPosition);
	  	}
	  }
	});
}

function addGroupsData(groupsList, groupId){
	for(var i = 0; i < groupsList.length; i++){
		(function () {
		var buttonId = groupId + '_button_' + i;
		
		var additionalClass;

		var btn = document.createElement("BUTTON");        // Create a <button> element
		var t = document.createTextNode(groupsList[i].groupTitle);       // Create a text node
		btn.appendChild(t);        
		btn.classList.add('button');
		btn.setAttribute("id", buttonId);
		btn.classList.add('unselected');                        // Append the text to <button>
		document.getElementById(groupId).appendChild(btn);        

		btn.addEventListener('click', function(){
		    changeSelection(buttonId, groupId);
		}, false);
	}())
  }
}

function addTimePeriodData(groupsList, groupId){
	for(var i = 0; i < groupsList.length; i++){
		(function () {
		var buttonId = groupId + '_button_' + i;
		
		var additionalClass;

		var btn = document.createElement("BUTTON");        // Create a <button> element
		var t = document.createTextNode(groupsList[i]);       // Create a text node
		btn.appendChild(t);        
		btn.classList.add('button');
		btn.setAttribute("id", buttonId);
		btn.classList.add('unselected');                        // Append the text to <button>
		document.getElementById(groupId).appendChild(btn);        

		btn.addEventListener('click', function(){
		    changeSelection(buttonId, groupId);
		}, false);
	}())
  }
}

function addDropdownGroupData(groupsList, containerId){
	for(var i = 0; i < groupsList.length; i++){
		var dropDownItem = "<a class='dropdown-item' href='#' data-toggle='modal' data-target='#exampleModalCenter' data-groupid='" + i + "'><div><p><strong>" + groupsList[i].groupTitle + "</strong></p></div></a>";
		$('#' + containerId).append(dropDownItem);
	}
	var newGroupItem = "<a class='dropdown-item add-new' href='#' data-toggle='modal' data-target='#exampleModalCenter'><div><p><strong>New Group</strong></p></div></a>"
	$('#'+containerId).append(newGroupItem);
}

function addFavoritesDropdownData(dataList, containerId){
	for(var i = 0; i < dataList.length; i++){

		var time;
		if(dataList[i].time.type == "Before" || dataList[i].time.type == "After"){
			time = dataList[i].time.type + " " + dataList[i].time.values[0];
		}
		else if(dataList[i].time.type == "Custom"){
			time = dataList[i].time.values[0] + " - " + dataList[i].time.values[1];	
		}
		else{
			time = dataList[i].time.values[0];	
		}

		var dropDownItemId = "favorites_dropdown_item_" + i;

		var dropDownItem = "<a class='dropdown-item' href='#' data-position='" + i + "' id='" + dropDownItemId + "'><div><img src='images/delete.png'><p><strong>" + dataList[i].groups[0] + " vs " + dataList[i].groups[1] + "</strong></p><p>" + time + "</p></div></a>";
		
		$('#'+containerId).append(dropDownItem);
		
		$('#'+dropDownItemId).on('click', function(){
			updateView(this.dataset.position);
		});
	}
}

function updateView(favoritesPosition){
	resetView();
	updateGroupView(favoritesPosition);
	updateTimePeriodView(favoritesPosition);
	$('#clear_button').removeClass('disabled');
}

function updateGroupView(favoritesPosition){
	var groupAButton = $('#group_a > button:contains(' + jsonData.favorites[favoritesPosition].groups[0] + ')');
	changeSelection(groupAButton[0].id, "group_a");

	var groupBButton = $('#group_b > button:contains(' + jsonData.favorites[favoritesPosition].groups[1] + ')');
	changeSelection(groupBButton[0].id, "group_b");
}

function updateTimePeriodView(favoritesPosition){
	var time = jsonData.favorites[favoritesPosition].time;
	console.log(time);

	if(time.type == "Before"){
		$('#datepicker3').val(time.values[0]);
	}
	else if(time.type == "After"){
		$('#datepicker4').val(time.values[0]);
	}
	else if(time.type == "Custom"){
		$('#datepicker1').val(time.values[0]);
		$('#datepicker2').val(time.values[1]);
	}
	else if(time.type == "fixed"){
		var timePeriodButton = $('#time_period_group > button:contains(' + time.values[0] + ')');
		changeSelection(timePeriodButton[0].id, "time_period_group");
	}
}

function resetView(){
	changeSelection("0", "time_period_group");
	changeSelection("0", "group_a");
	changeSelection("0", "group_b");
	$('#datepicker1').val('');
	$('#datepicker2').val('');
	$('#datepicker3').val('');
	$('#datepicker4').val('');
	$('#clear_button').addClass('disabled');
}

function changeSelection(buttonId, groupId){
	var selectedItem = $('#'+ groupId + '.group > ' + '.selected');
	if(selectedItem.length != 0){
		selectedItem.removeClass('selected').addClass('unselected');
	}
	$('#'+buttonId).removeClass('unselected').addClass('selected');
}

$('#exampleModalCenter').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var groupId = button.data('groupid') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  
  var modal = $(this);
  var currentGroup = jsonData.groups[groupId];
  modal.find('#modal-title').text(currentGroup.groupTitle);
  modal.find('.group-items').empty();
  for(var i = 0; i < currentGroup.groupUsersList.length; i++){
  	var userItem = "<div class='row card-item'><div class='col-2 text-left'><img src='images/user-profile.jpg' class='user-profile-icon-small' alt='user-photo'></div><div class='col-8 text-left'><p><strong>" + currentGroup.groupUsersList[i].userName + "</strong></p><p>" + currentGroup.groupUsersList[i].userEmail + "</p></div><div class='col-2 text-right'><img src='images/success.png' class='user-check-mark-icon' alt='check-mark'></div></div>";

  	modal.find('.group-items').append(userItem);
  }
});