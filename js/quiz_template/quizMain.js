ubsApp.getQuizTemplate = function(templateConfig, tempVar){
	if(templateConfig.options!=undefined){
		ubsDecisionOption = templateConfig.options[0].optionName;
	}
	tempVar.html+=ubsQuizTemplate(templateConfig);
}

ubsApp.doneQuiz=function(){
	this.currentPlayerContents();
	ubsApp.cancelQuiz();
}


ubsApp.atleastOneSelected= function(name){
	var radio = document.getElementsByName(name);
  	for (var i=0; i<radio.length; i++) {

    if (radio[i].checked) {
      return true;
    }
  }
  return false;
}



ubsApp.nextQuizQuestion=function(page, answer, name){

  if(ubsApp.atleastOneSelected(name)){
  	  var c = $("#correctAnswers").html();
	  let checkedValue = $("input[name='" + ubsDecisionOption + "'	]:checked").attr("id");
	  let questionNo = $("#quizQuestionNumber").html();

	  if(checkedValue==answer){
	  	c = parseInt(c);
	  	c=c+1;
	  	ubsApp.updateAnswers(questionNo-1);
	  }
	  else{
	  	// console.log("Answer is wrong");
	  }

	  ubsApp.renderPageByName(page);

	  if(ubsApp.pages[page].templates[0].quizResult){

	  		$("#quizCancel").attr("disabled", true);
	  		$("#quizDone").attr("disabled", false);
	  		if(page == "luckQuizResult"){
	  			ubsApp.luckQuizResult();
	  		}
	  		else if(page == "generalQuizResult"){
	  			ubsApp.generalQuizResult();
	  		}
	  }
	  else{
		  	questionNo=parseInt(questionNo)+1;
		  	$("#quizQuestionNumber").text(questionNo);
	  }
	  $("#correctAnswers").text(c);
  }
}

ubsApp.updateAnswers = function(questionNo){
	 choiceSelected.answers[questionNo]=true;
}

ubsApp.getTotalCorrectAnswers= function(){

   let x=0;
   for(let i=0; i<choiceSelected.answers.length;i++){
     if(choiceSelected.answers[i] == true) {
        x++;
     }
	}
    return x;
}



ubsApp.luckQuizResult=function(){

	let infoPage = ubsApp.pages[choiceSelected.page].templates[0];
	let inventory = 0;
	let bankBalance =0;
	let reputationPoints = 0;
	let cash = 0;
	let correctAnswers = ubsApp.getTotalCorrectAnswers();
	for(let i=0;i<choiceSelected.answers.length;i++){
		if(choiceSelected.answers[i]==false){
		   inventory += choiceSelected.credit[i].inventory;
		   bankBalance += choiceSelected.credit[i].bankBalance;
		   reputationPoints += choiceSelected.credit[i].reputationPoints;
		   cash += choiceSelected.credit[i].cash;
		}
	}
	let playerRepPoints = userArray[playerChance].getReputationPts();
	userArray[playerChance].setReputationPts(playerRepPoints+reputationPoints);

	let playerCash = userArray[playerChance].getplayerScore();
	userArray[playerChance].setplayerScore(playerCash+cash);

	let playerBankBalance = userArray[playerChance].getBankBalance();
	userArray[playerChance].setBankBalance(playerBankBalance+bankBalance);

	let playerInventory = userArray[playerChance].getInventoryScore();
	userArray[playerChance].setInventoryScore(playerInventory+inventory);

	if(correctAnswers == 1){
		$("#quizResult").text(infoPage.positiveMsg);

	}else{
		$("#quizResult").text(infoPage.negativeMsg);
		}

}

ubsApp.generalQuizResult=function(page){

	let resultPage = ubsApp.pages[choiceSelected.page].templates[0];
	let inventory = 0;
	let bankBalance =0;
	let reputationPoints = 0;
	let cash = 0;

	let correctAnswers = ubsApp.getTotalCorrectAnswers();
	for(let i=0;i<choiceSelected.answers.length;i++){
		if(choiceSelected.answers[i]==true){
		   inventory += choiceSelected.credit[i].inventory;
		   bankBalance += choiceSelected.credit[i].bankBalance;
		   reputationPoints += choiceSelected.credit[i].reputationPoints;
		   cash += choiceSelected.credit[i].cash;
		}
	}
	let playerRepPoints = userArray[playerChance].getReputationPts();
	userArray[playerChance].setReputationPts(playerRepPoints+reputationPoints);

	$("#quizResult").text(resultPage.msg1 + correctAnswers + resultPage.msg2 + reputationPoints);
}




//ubsApp.getChoiceTemplate = function(templateConfig, tempVar){
//	if(ubsApp.areAllChoicesSelected() == true) {
//        choiceSelected={};
//        if(templateConfig.nextPage.page){
//        	ubsApp.renderPageByName(templateConfig.nextPage.page);
//        }
//        else{
//        	ubsApp.nextMove();
//        }
//        return;
//    }
//	ubsApp.updateChoiceSelected(templateConfig);
//	if(templateConfig.display_score){
//		tempVar.html += ubsScoreTemplate(ubsApp.pages.score[0]);
//	}
//	let containerHeight = $(window).innerHeight() - 50;
//	for(let i=0; i< templateConfig.choices.length; i++)  {
//		templateConfig.choices[i].display = choiceSelected[i];
//		templateConfig.choices[i].choiceHeight = (containerHeight / templateConfig.choiceHeightFactor) + 'px';
//	}
//	templateConfig.containerHeight= $(window).innerHeight() +'px';
//  	html += ubschoiceTemplate(templateConfig);
//  	if(templateConfig.audioSrc){
//  		audioConfig = templateConfig;
//  		tempVar.html+= ubsAudioTemplate(templateConfig);
//	}
//}


//ubsApp.checkSelected= function(){
//
//   let allSelected = true;
//	$.each(choiceSelected, function(key,value){
//     if(value == true) {
//     	allSelected =  false;
//		return false;
//     }
//});
//	return allSelected;
//}