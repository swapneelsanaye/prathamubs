ubsApp.getPurchaseTemplate=function(templateConfig,tempVar){
	var object={};

	object.bankBalance="Rs. "+userArray[playerChance].getBankBalance();
	object.cash="Rs. "+userArray[playerChance].getplayerScore();
	object.credit="Rs. "+userArray[playerChance].getCredit();
	object.sliderValue=userArray[playerChance].getInventoryScore();
	
	object.inventoryValue=userArray[playerChance].getInventoryScore()*1000;
    object.creditLimit="Rs. "+userArray[playerChance].getCreditLimit();
    templateConfig=$.extend(templateConfig,object);
	tempVar.html+=ubsPurchaseTemplate(templateConfig);
}


ubsApp.updateInventoryLevel=function(value){
    if(parseFloat(value)<parseFloat(userArray[playerChance].getInventoryScore())){	//instead of 20 write userArray[playerChance].getInventoryScore()
        document.getElementById("mySlider").value=userArray[playerChance].getInventoryScore();	//userArray[playerChance].getInventoryScore()
        document.getElementById("percent").innerHTML=userArray[playerChance].getInventoryScore().toFixed(2)+"%";	//userArray[playerChance].getInventoryScore()
        document.getElementById("value").innerHTML="Rs. "+userArray[playerChance].getInventoryScore()*1000;	//userArray[playerChance].getInventoryScore()*1000;
    }
    else{
        document.getElementById("percent").innerHTML=parseFloat(value).toFixed(2)+"%";
        document.getElementById("value").innerHTML="Rs. "+parseInt(value*1000); 
    }
    
}
ubsApp.fillUp=function(){
var temp=document.getElementById("value").innerHTML;
document.getElementById("newInventoryLevelText").value=document.getElementById("percent").innerHTML;
document.getElementById("newCostText").value="Rs. "+(parseInt(temp.substring(4))-userArray[playerChance].getInventoryScore()*1000);//-userArray[playerChance].getInventoryScore()*1000;
}

ubsApp.pay=function(){
document.getElementById("result").innerHTML="";
var paymentDone=false;
var cost=document.getElementById("newCostText").value;
cost=parseInt(cost.substring(4));
if(cost){
var creditChanged=userArray[playerChance].getCredit();
var bankBalanceChanged=userArray[playerChance].getBankBalance();
var cashChanged=userArray[playerChance].getplayerScore();
var newLevel=document.getElementById("newInventoryLevelText").value;
newLevel=parseInt(newLevel.substring(0,newLevel.length));
var totalAmountEntered=0;
for(var i=1;i<=numberOfPaymentModes;i++){
    if(document.getElementById("parent"+i).style.display!="none"){
        if(document.getElementById("amount"+i).value)
        totalAmountEntered+=parseInt(document.getElementById("amount"+i).value);
        else{
            document.getElementById("result").innerHTML=ubsApp.translation["validAmount"];
            break;		
        }
    }
}
if(totalAmountEntered<cost){
    document.getElementById("result").innerHTML=ubsApp.translation["lessMoney"];
}

else if(totalAmountEntered>cost){
    document.getElementById("result").innerHTML=ubsApp.translation["moreMoney"];
}
else{
    document.getElementById("result").innerHTML="";
    for(var i=1;i<=numberOfPaymentModes;i++){
        if(document.getElementById("parent"+i).style.display!="none"){
        var dropDown=document.getElementById("pay"+i);
        var paymentMode=dropDown.options[dropDown.selectedIndex].value;
        var amount=parseInt(document.getElementById("amount"+i).value);
        if(paymentMode=="cash"){
            if(amount<=userArray[playerChance].getplayerScore()){
                
                cashChanged=userArray[playerChance].getplayerScore()-amount;
                totalAmountEntered-=amount;
                //userArray[playerChance].setplayerScore();
            }
            else{
                document.getElementById("result").innerHTML=ubsApp.translation["moreCash"];
                break;
            }
        }
        else if(paymentMode=="cheque"){
            if(amount<=userArray[playerChance].getBankBalance()){
                //userArray[playerChance].setInventoryScore(newLevel);
                bankBalanceChanged=userArray[playerChance].getBankBalance()-amount;
                totalAmountEntered-=amount;
                //userArray[playerChance].setBankBalance();
            }
            else{
                document.getElementById("result").innerHTML=ubsApp.translation["bankBalance"];
                break;
            }
        }
        else if(paymentMode=="credit"){
            if(amount<=userArray[playerChance].getCreditLimit()-userArray[playerChance].getCredit()){
                //userArray[playerChance].setInventoryScore(newLevel);

                creditChanged=userArray[playerChance].getCredit()+amount;
                userArray[playerChance].setPayOffDeadline(numberOfWeeksDeadline);
                totalAmountEntered-=amount;
                //userArray[playerChance].setCredit();
            }
            else{
                document.getElementById("result").innerHTML=ubsApp.translation["lotDebt"];
                break;
            }
        }
    }
    }
    if(totalAmountEntered==0)
    {
        paymentDone=true;
    }
    if(paymentDone){
        userArray[playerChance].setInventoryScore(newLevel);
        userArray[playerChance].setplayerScore(cashChanged);
        userArray[playerChance].setBankBalance(bankBalanceChanged);
        userArray[playerChance].setCredit(creditChanged);
        var temptimer;
        var temptime=20;	
        temptimer = setInterval(function(){
            temptime--;
            
        document.getElementById("bankBalanceValue").innerHTML="Rs. "+userArray[playerChance].getBankBalance();
        document.getElementById("cashValue").innerHTML="Rs. "+userArray[playerChance].getplayerScore();
        document.getElementById("creditValue").innerHTML="Rs. "+userArray[playerChance].getCredit();
        document.getElementById("creditLimitValue").innerHTML="Rs. "+userArray[playerChance].getCreditLimit();
            if(temptime === 0 ){
                clearInterval(temptimer);
                if(!offlinePurchaseClicked)
                    ubsApp.nextMove();
                else{
                    ubsApp.closeCurrentScenario();
                    ubsApp.currentPlayerContents();
                    offlinePurchaseClicked=false;
                }		
            }
        },50);
        // document.getElementById("bankBalanceValue").innerHTML=userArray[playerChance].getBankBalance();
        // document.getElementById("cashValue").innerHTML=userArray[playerChance].getplayerScore();
        // document.getElementById("creditValue").innerHTML=userArray[playerChance].getCredit();
        // document.getElementById("creditLimitValue").innerHTML=userArray[playerChance].getCreditLimit();
        // ubsApp.wait(3000);
        
        //setTimeout(ubsApp.nextMove(), 3000);
        
    }
        
}
}
else{
document.getElementById("result").innerHTML=ubsApp.translation["pleaseConfirm"];
}
}

// ubsApp.showScore=function(){
// 	var element=document.getElementById("purchaseLeaderBoard");
// 	elem
// }
    
ubsApp.addPaymentMode=function(){
for(var i=1;i<=numberOfPaymentModes;i++){
    if(document.getElementById("parent"+i).style.display=="none"){
        document.getElementById("parent"+i).style.display="";
        break;
    }
}
}

ubsApp.wait=function(ms){
var start = new Date().getTime();
var end = start;
while(end < start + ms) {
 end = new Date().getTime();
}
}

ubsApp.openPurchaseScenario=function(){
	offlinePurchaseClicked=true;
	ubsApp.startCurrentScenario();
	ubsApp.renderPageByName("purchaseScenario");
}