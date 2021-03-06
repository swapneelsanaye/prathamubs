ubsApp.getDecisionTemplate=function(templateConfig,tempVar){
var object={};
object.balance = userArray[playerChance].getBankBalance();
object.cash = userArray[playerChance].getplayerScore();
object.debt = userArray[playerChance].getCredit();
object.inventory = userArray[playerChance].getInventoryScore();
object.inventoryValue = (userArray[playerChance].getInventoryScore()*1000);
object.reputationPts = userArray[playerChance].getReputationPts();
object = $.extend(true, templateConfig, object);
tempVar.html+=ubsDecisionTemplate(object);
}

ubsApp.renderDecisonTemplate = function() {
  let checkedValue = $("input[name='" + ubsDecisionOption + "'	]:checked").attr("id");
  answerselected=$("#" + checkedValue + "Amount").text();
  inventoryToBeUpdated=$("#" + checkedValue + "Inventory").text();


  clearInterval(interval);
  clearInterval(timeVar);
  this.renderPage(ubsApp.pages[ubsDecisionOptionMap[checkedValue].page]);

}

ubsApp.decisionOptions = function(reputationPts, bankBalance, insurance=false, page="", pamphlet=false){

	let playerRepPoints = userArray[playerChance].getReputationPts();
	userArray[playerChance].setReputationPts(playerRepPoints+parseInt(reputationPts));
	let playerBankBalance = userArray[playerChance].getBankBalance();
	userArray[playerChance].setBankBalance(playerBankBalance+parseInt(bankBalance));
	if(insurance == "true"){
	 ubsApp.renderPageByName(page);
	}
	else if(pamphlet == "true"){
		let profit = Math.floor(Math.random() * 2500) + 500;
		let playerBankBalance = userArray[playerChance].getBankBalance();
		userArray[playerChance].setBankBalance(playerBankBalance+profit);
		ubsApp.nextMove();
	}

	else{
		ubsApp.nextMove();
	}
}


//Computer Player

ubsApp.playDecisionTemplate =function(decisionConfig){
    var player= userArray[playerChance];
	var correctProbability = player.getCorrectProbability();
	var number = player.getCorrectAnswered();
	var answer = ubsApp.chooseAnswer(decisionConfig, correctProbability, number);
	$("input[type=radio]").attr('disabled', true);
	$('#submitQuestion').attr('disabled', true);
	setTimeout(function(){
		$("input[type=radio]").attr('disabled', false);
 		$("input[name='"+ubsDecisionOption+"'][value='"+answer+"']").attr('checked', true);
 		$("input[type=radio]:not(input[name='"+ubsDecisionOption+"'][value='"+answer+"'])").attr('disabled', true);
 		setTimeout(function(){
 			$('#submitQuestion').attr('disabled', false);
 			$("input[type=radio]").attr('disabled', false);
 			$('#submitQuestion').trigger('click');
 		},decisionConfig.optionsTime);
  	},decisionConfig.questionTime);
}


ubsApp.chooseAnswer = function(decisionConfig, correctProbability, number){
	var totalOptions = decisionConfig.options.length;
	var optionConfig={};
	var selectRange = Math.random();
	if(selectRange<=correctProbability){
        number++;
        userArray[playerChance].setCorrectAnswered(number);
		for(let i=0;i<totalOptions; i++){
			if(decisionConfig.options[i].priority == "1"){
				return decisionConfig.options[i].optionValue;
			}
		}
	}
	else{
		 var randomPriority =(Math.floor(Math.random()*(totalOptions-1))+2);
		 for(let i=0;i<totalOptions; i++)
			{
				if(decisionConfig.options[i].priority == ""+randomPriority){
					return decisionConfig.options[i].optionValue;
			}
		}
	}
}


//Computer Player

// ubsApp.getDecisionTemplate = function(templateConfig, tempVar){
// 	tempVar.decisionConfig = templateConfig;
// 	tempVar.html += ubsDecisionTemplate(templateConfig);
// 	ubsDecisionOption = templateConfig.options[0].optionName;
// 	if(templateConfig.display_score){
// 		tempVar.html += ubsScoreTemplate(ubsApp.pages.score[0]);
// 	}
// 	if(templateConfig.score_animation_req){
// 		tempVar.flag=true;
// 	}
// 	ubsDecisionOptionMap = templateConfig.optionPageMap;
// }



