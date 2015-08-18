String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.open("GET","http://www.nfl.com/liveupdate/scorestrip/ss.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML; 

var x=xmlDoc.getElementsByTagName("g");
console.log(x);
console.log(x.length);
var gameID = 0;
var hnn="";
var vnn="";
var hscore=0;
var vscore=0;
var saintsHome=true;
for(i=0;i<x.length;i++){
  eid=x[i].getAttribute("eid");
  h=x[i].getAttribute("h");
  v=x[i].getAttribute("v");
  if(h == "NO"){
    gameID = eid;
    oppName = x[i].getAttribute("vnn");
    saintsScore=x[i].getAttribute("hs");
    oppScore=x[i].getAttribute("vs");
    oppName=oppName.capitalize();
    saintsHome=true;
  }
  if(v == "NO"){
  	gameID = eid;
    oppName = x[i].getAttribute("hnn");
    saintsScore=x[i].getAttribute("vs");
    oppScore=x[i].getAttribute("hs");
    oppName=oppName.capitalize();
    saintsHome=false;
  }
}
console.log(gameID);
var json_data_url = "http://www.nfl.com/liveupdate/game-center/"+gameID+"/"+gameID+"_gtd.json";
console.log(json_data_url);
console.log(oppName);
document.getElementById("oppLabel").innerHTML=oppName;
document.getElementById("saintsScore").innerHTML=saintsScore;
document.getElementById("oppScore").innerHTML=oppScore;

$.getJSON(json_data_url, function(data) {
	if(saintsHome==true){
		saints=data[gameID]["home"];
		opp=data[gameID]["away"];
	}
	else{
		saints=data[gameID]["away"];
		opp=data[gameID]["home"];
	}

	saints_scoring = saints["score"];
	opp_scoring = opp["score"];
	document.getElementById("summaryTable").innerHTML="<tr><td><font color='#9F8958'>Saints</font></td><td>"+saints_scoring[1]+"</td><td>"+saints_scoring[2]+"</td><td>"+saints_scoring[3]+"</td><td>"+saints_scoring[4]+"</td><td>"+saints_scoring[5]+"</td><td>"+saints_scoring["T"]+"</td></tr><tr><td><span class='text-success'>"+oppName+"</span></td><td>"+opp_scoring[1]+"</td><td>"+opp_scoring[2]+"</td><td>"+opp_scoring[3]+"</td><td>"+opp_scoring[4]+"</td><td>"+opp_scoring[5]+"</td><td>"+opp_scoring["T"]+"</td></tr>";

	saints_team = saints["stats"]["team"];
	opp_team = opp["stats"]["team"];
	console.log(opp_team);
	document.getElementById("summaryStats").innerHTML="<tr><td><font color='#9F8958'>"+saints_team["totfd"]+"</font></td><td><center>1st downs</center></td><td><span class='text-success' style='float: right;'>"+opp_team["totfd"]+"</span></td></tr><tr><td><font color='#9F8958'>"+saints_team["totyds"]+"</font></td><td><center>Total yards</center></td><td><span class='text-success' style='float: right;'>"+opp_team["totyds"]+"</span></td></tr><tr><td><font color='#9F8958'>"+saints_team["pyds"]+"</font></td><td><center>Passing yards</center></td><td><span class='text-success' style='float: right;'>"+opp_team["pyds"]+"</span></td></tr><tr><td><font color='#9F8958'>"+saints_team["ryds"]+"</font></td><td><center>Rushing yards</center></td><td><span class='text-success' style='float: right;'>"+opp_team["ryds"]+"</span></td></tr><tr><td><font color='#9F8958'>"+saints_team["trnovr"]+"</font></td><td><center>Turnovers</center></td><td><span class='text-success' style='float: right;'>"+opp_team["trnovr"]+"</span></td></tr><tr><td><font color='#9F8958'>"+saints_team["pen"]+"-"+saints_team["penyds"]+"</font></td><td><center>Penalties - Yds</center></td><td><span class='text-success' style='float: right;'>"+opp_team["pen"]+"-"+opp_team["penyds"]+"</span></td></tr>";



	var saintsPassers = $.map(saints["stats"]["passing"], function (value, key) { return value; });
	var strSaintsPassers=""
	for(i=0;i<saintsPassers.length;i++){
		strSaintsPassers+="<tr><td>"+saintsPassers[i]["name"]+"</td><td>"+saintsPassers[i]["cmp"]+"</td><td>"+saintsPassers[i]["att"]+"</td><td>"+saintsPassers[i]["yds"]+"</td><td>"+saintsPassers[i]["tds"]+"</td><td>"+saintsPassers[i]["ints"]+"</td></tr>";
	}
	document.getElementById("saintsPassing").innerHTML=strSaintsPassers;

	var saintsRushers = $.map(saints["stats"]["rushing"], function (value, key) { return value; });
	var strSaintsRushers=""
	for(i=0;i<saintsRushers.length;i++){
		strSaintsRushers+="<tr><td>"+saintsRushers[i]["name"]+"</td><td>"+saintsRushers[i]["att"]+"</td><td>"+saintsRushers[i]["yds"]+"</td><td>"+Math.round((saintsRushers[i]["yds"]/saintsRushers[i]["att"])*10)/10+"</td><td>"+saintsRushers[i]["tds"]+"</td><td>"+saintsRushers[i]["lng"]+"</td></tr>";
	}
	document.getElementById("saintsRushing").innerHTML=strSaintsRushers;

	var saintsReceivers = $.map(saints["stats"]["receiving"], function (value, key) { return value; });
	var strSaintsReceivers=""
	for(i=0;i<saintsReceivers.length;i++){
		strSaintsReceivers+="<tr><td>"+saintsReceivers[i]["name"]+"</td><td>"+saintsReceivers[i]["rec"]+"</td><td>"+saintsReceivers[i]["yds"]+"</td><td>"+Math.round((saintsReceivers[i]["yds"]/saintsReceivers[i]["rec"])*10)/10+"</td><td>"+saintsReceivers[i]["tds"]+"</td><td>"+saintsReceivers[i]["lng"]+"</td></tr>";
	}
	document.getElementById("saintsReceiving").innerHTML=strSaintsReceivers;


	var saintsDefenders = $.map(saints["stats"]["defense"], function (value, key) { return value; });
	var strSaintsDefenders=""
	for(i=0;i<saintsDefenders.length;i++){
		strSaintsDefenders+="<tr><td>"+saintsDefenders[i]["name"]+"</td><td>"+saintsDefenders[i]["tkl"]+"-"+saintsDefenders[i]["ast"]+"</td><td>"+saintsDefenders[i]["sk"]+"</td><td>"+saintsDefenders[i]["int"]+"</td><td>"+saintsDefenders[i]["ffum"]+"</td></tr>";
	}
	document.getElementById("saintsDefense").innerHTML=strSaintsDefenders;







	var oppPassers = $.map(opp["stats"]["passing"], function (value, key) { return value; });
	var strOppPassers=""
	for(i=0;i<oppPassers.length;i++){
		strOppPassers+="<tr><td>"+oppPassers[i]["name"]+"</td><td>"+oppPassers[i]["cmp"]+"</td><td>"+oppPassers[i]["att"]+"</td><td>"+oppPassers[i]["yds"]+"</td><td>"+oppPassers[i]["tds"]+"</td><td>"+oppPassers[i]["ints"]+"</td></tr>";
	}
	document.getElementById("oppPassing").innerHTML=strOppPassers;

	var oppRushers = $.map(opp["stats"]["rushing"], function (value, key) { return value; });
	var strOppRushers=""
	console.log(oppRushers[0])
	for(i=0;i<oppRushers.length;i++){
		strOppRushers+="<tr><td>"+oppRushers[i]["name"]+"</td><td>"+oppRushers[i]["att"]+"</td><td>"+oppRushers[i]["yds"]+"</td><td>"+Math.round((oppRushers[i]["yds"]/oppRushers[i]["att"])*10)/10+"</td><td>"+oppRushers[i]["tds"]+"</td><td>"+oppRushers[i]["lng"]+"</td></tr>";
	}
	document.getElementById("oppRushing").innerHTML=strOppRushers;

	var oppReceivers = $.map(opp["stats"]["receiving"], function (value, key) { return value; });
	var strOppReceivers=""
	for(i=0;i<oppReceivers.length;i++){
		strOppReceivers+="<tr><td>"+oppReceivers[i]["name"]+"</td><td>"+oppReceivers[i]["rec"]+"</td><td>"+oppReceivers[i]["yds"]+"</td><td>"+Math.round((oppReceivers[i]["yds"]/oppReceivers[i]["rec"])*10)/10+"</td><td>"+oppReceivers[i]["tds"]+"</td><td>"+oppReceivers[i]["lng"]+"</td></tr>";
	}
	document.getElementById("oppReceiving").innerHTML=strOppReceivers;


var oppDefenders = $.map(opp["stats"]["defense"], function (value, key) { return value; });
	var strOppDefenders=""
	for(i=0;i<oppDefenders.length;i++){
		strOppDefenders+="<tr><td>"+oppDefenders[i]["name"]+"</td><td>"+oppDefenders[i]["tkl"]+"-"+oppDefenders[i]["ast"]+"</td><td>"+oppDefenders[i]["sk"]+"</td><td>"+oppDefenders[i]["int"]+"</td><td>"+oppDefenders[i]["ffum"]+"</td></tr>";
	}
	document.getElementById("oppDefense").innerHTML=strOppDefenders;



});
