var path="";
var filmid="";
var show={};
var showid="";
var cinemaid="";
var sectionid="";
var showdate="";
var showls=[];
var currentShowIndex=0;

function updateSelectedSeat(target,a){
	var ls=$("#selectedLs");
	$(".seat",ls).removeClass("selected").removeClass("unselected");
	$(".seat .txt",ls).text("待选座位");
	$(".activitySeatBox").html("");
	for(var i=0;i<a.length;i++){
		var li=$("li:eq("+i+")",ls);
		var seat=$(".seat",li);
		var activitySeatBox=$(".activitySeatBox",li);
		seat.addClass("selected");
		if(a[i].activityseat){
			var astag=$('<img src="" class="activitySeatTag"/>');
			astag.attr("src",path+"/images/aodi-selected.png");
			astag.appendTo(activitySeatBox);
		}else{
			activitySeatBox.html("");
		}
		$(".txt",seat).text(a[i].row_name+"排"+a[i].col_name+"座");
	}
}
function updateShow(){
	if(show && show.filmname){
		showid=show.sid;
		$("#filmname").text(show.filmname);
		$("#dimen").html("&nbsp;"+show.dimen);
		$("#hallname").text(show.hall.appshortname);
		$("#filmtime").text(new Date(show.starttime*1000).format("yyyy.MM.dd hh:mm"));
	}
}	
$(function(){
	filmid=getParam("filmid");
	showid=getParam("showid");
	cinemaid=getParam("cinemaid");
	sectionid=getParam("sectionid");
	
	var filmname = window.localStorage.getItem('val');
	$('#filmname').text(filmname);
	var showDate=getParam("showdate");
	var dater = parseInt(showDate);
	var date=new Date(dater);
	$('#filmdate').text(date.format("yyyy年M月d日"));
	var startTime=getParam("starttime");
	$('#filmtime').text(startTime);
	var hallname = getParam("hallname");
	$('#hallname').text(hallname);
	window.localStorage.setItem('hallname',hallname);
	var edition = getParam("edition");
	$('#dimen').text(edition);
	
	show.sid=showid;
	$.fn.seat.defaults.onSeatSelected=function(target,data){
		var seats=$(target).seat("getSelected");
		updateSelectedSeat(target,seats);
	};
	$.fn.seat.defaults.onSeatUnselected=function(target,data){
		var seats=$(target).seat("getSelected");
		updateSelectedSeat(target,seats);
	};
	$.fn.seat.defaults.onLoadDataComplet=function(target,data){
		if(data && data.show){
			$("#filmshowbar").show();
			$("#seatlegendbar").show();
			$("#seatyinmubar").show();
			$("#selectedSeats").show();
			$("#tobuybar").show();
			show=data.show;
			updateShow();
			var seats=$(target).seat("getSelected");
			//判断选中座位
			updateSelectedSeat(target,seats);
		}else{
			$("#filmshowbar").hide();
			$("#seatlegendbar").hide();
			$("#seatyinmubar").hide();
			$("#selectedSeats").hide();
			$("#tobuybar").hide();
		}
	};
	
	var seatparams={"showid":showid,"sectionid":sectionid};
	//加载座位
	$("#seat").seat({url: "newseats.json"},seatparams);
	
	$("#selectedLs .seat").click(function(){
		if($(this).is(".selected")){
			var seats=$("#seat").seat("getSelected");
			var currnetli=$(this).closest("li");
			var index=currnetli.index();
			$("#seat").seat("unselectSeat",seats[index]);
		}
	});
	//加载放映场次列表
	var showParam={
		"filmid":filmid,
		"cinemaid":cinemaid,
		"showdate":showdate,
		"start":0,
		"num":20
	};
	$("#tobuy").click(function(){
		var seats=$("#seat").seat("getSelected");
		var seatString = seats.toString();
		var param={};
		if(seats.length>0){
			param.showid=showid;
			param.cinemaid=cinemaid;
			param.sectionid="01";
			param.show=JSON.stringify(show);
			var array=[];
			for(var i=0;i<seats.length;i++){
				array.push(seats[i]);
			}
			param.seat=JSON.stringify(array);
			var url = "makeorder.html?seat="+JSON.stringify(array);
			window.location.href=url;
			var countdownMinute = 15;//15分钟倒计时 
		    var startTimes = new Date();//开始时间 new Date('2016-11-16 15:21'); 
		    var endTimes = new Date(startTimes.setMinutes(startTimes.getMinutes()+countdownMinute));//结束时间 
		    window.localStorage.setItem('timeout',endTimes);
		}else{
			$.Confirm({"html":"您还没选择座位！","buttons":{"确定":function(){}}});
		}
	});
});