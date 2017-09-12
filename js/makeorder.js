$(function(){
	var cinamename = window.localStorage.getItem('ciname');
	var filmname = window.localStorage.getItem('val');
	$('.cinemaname').text(cinamename);
	$('.filmname').text(filmname);
	
	var seates = getParam('seat');
	var seat = JSON.parse(seates);
	var seats = $(".seatinfo");
	for (i=0;i<seat.length;i++) {
		var span = $('<span>'+seat[i].row_name+'排'+seat[i].col_name+'座</span>');
		span.appendTo(seats);
	}
	var hallname = window.localStorage.getItem('hallname');
	$('.hallname').text(hallname);
	
	$('.orderbtn').click(function(){
		alert(1);
	})
	timeOut();
});
//时间倒计时
	function timeOut(){
		var countdownMinute = 15;//10分钟倒计时 
		var now = new Date();
//		var will = new Date(now.setMinutes(now.getMinutes()+countdownMinute)); 
		
//		console.log(will);
//		var surplusTimes = will.getTime()/1000 - now.getTime()/1000;
//		console.log(surplusTimes);
		
		var minu = Math.floor(now/1000/60/60%24); 
		console.log(minu);
//    	var secd = Math.round(surplusTimes%60);
		
		var cc = document.getElementById(time); 
//		cc.innerHTML = "脚本之家提示距离"+year+"年"+month+"月"+day+"日还有："+day1+"天"+hour+"小时"+minute+"分"+second+"秒";  
	}
//	setInterval(timeOut,1000);
