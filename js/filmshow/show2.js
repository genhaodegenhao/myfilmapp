template.config('openTag','<#');
template.config('closeTag', '#>');

//场次列表
var filmListTem = '<ul class="show_info_list">'+
					'<#for(var i=0;i<data.length;i++){ #>'+
					'<#var filmList = data[i]; #>'+
					'<#for(var j=0;j<data[i].shows.length;j++){ #>'+
					'<#var filmListInfo = data[i].shows[j]; #>'+
					'<li onclick="fastView.chooseShow(\<#=354#>\,\<#=20170905144111543230#>\,\<#=20170608110444423753#>\,\<#=filmList.show_date#>\,\'<#=filmListInfo.show_time.substring(11,16)#>\',\'<#=filmListInfo.hallName#>\',\'<#=filmListInfo.edition#>\')" class="show_info_box">'+
					'<div class="show_info">'+
					'<div class="show_time info_item fl">'+
					'<span class="lcdd fzxl b"><#=filmListInfo.show_time.substring(11,16)#></span>&nbsp;&nbsp;<span class="show_lang fzs"><#=filmListInfo.lang#></span>'+
					'</div>'+
					'<div class="show_hall info_item fl">'+
						'<span class="fzs"><#=filmListInfo.hallName#></span>&nbsp;&nbsp;<span class="fzs"><#=filmListInfo.edition#></span>'+
						'</div>'+
						'<div class="show_price">'+
						'<span class="online_price fzxl b">￥50</span>'+
						'</div></div>'+
						'<div class="show_info">'+
						'<div class="end_time info_item fl">'+
						'<span class="fzs"><#=filmListInfo.endtime.substring(11,16)#></span><span class="ml4 fzs">结束</span>'+
						'</div>'+
						'<div class="left_ticket info_item fl">'+
						'<span class="fzs">余<#=filmListInfo.seatNums#></span>'+
						'</div></div>'+
					'</li>'+
					'<#}#>'+
					'<#}#>'+
				'</ul>'

$(function(){
	historyRec.replaceView({'viewId':'showWraper'},"","");
	//查询指定影片场次处理
	var filmId = getParam("filmid");
	
	fastView.initFilmShowHeader();
});

var fastView = (function(exports){
  	//日期按钮事件绑定
    function bindShowDateEvent(){
    	$("#showDateBtnBox").bind("click",function(e){
    		var tt=e.target;
    		if($(tt).is("a")){
    			getFilmShowByDate($(tt));
    		}
    	});
    }
    //影片放映头部处理
    function initFilmShowHeader(){
    	var ciname = window.localStorage.getItem('ciname');
    	var ciaddress = window.localStorage.getItem('ciaddress');
		var filmname = window.localStorage.getItem('val');
    	$('.cinema_name').text(ciname);
    	$('.cinema_addressed').text(ciaddress);
    	$('.title').text(filmname);
    	
    	updateFilmsession();
    }
    function updateFilmsession(){
    	var showDateBtnBox=$("#showDateBtnBox");
    	showDateBtnBox.html("");
    	var params={};
//  	params.cinemaid=cinemaId;
//  	params.filmid=filmId;
    	$.ajax({
			url: "filminfo.json",
	        dataType:'json',
	        success:function(result) {
				if(result && result.status==0&&result.data.length>0){
					//获取日期成功,且长度大于0
					for(var i=0;i<result.data.length;i++){
						var databtn=$('<a data-date="" data-index=""></a>');
		    			var showdate=result.data[i].show_date;
		    			var date=new Date(showdate);
		    			databtn.text(date.format("M月d日"));
		    			databtn.attr("data-date",showdate);
		    			databtn.attr("data-index",i);
		    			if(i===0){
		    				databtn.addClass("current");
		    			}
		    			databtn.appendTo(showDateBtnBox);
					}
					var textUnderline = $('<span class="underline"></span>');
					textUnderline.appendTo(showDateBtnBox);
				}else{
					//默认今天
					var dateToday = new Date(); //今天
		    		var showdate=getDateYYYYMMDD(dateToday);
		        	var databtn=$('<a data-date="" data-index="0" class=""></a>');
		        	databtn.attr("data-date",showdate);
					databtn.attr("data-index","0");
					databtn.text(dateToday.format("M月d日"));
		        	databtn.appendTo(showDateBtnBox);
				}
				bindShowDateEvent();
				dateChoose();
				//显示排期
		    	getFilmShowByDate($('#showDateBtnBox a').first());
	        },
	        error:function(){
	        	//默认今天
	        	var dateToday = new Date(); //今天
	    		var showdate=getDateYYYYMMDD(dateToday);
	        	var databtn=$('<a data-date="" data-index="0" class=""></a>');
	        	databtn.attr("data-date",showdate);
				databtn.attr("data-index","0");
				databtn.text("今日" + dateToday.format("M月d日"));
	        	databtn.appendTo(showDateBtnBox);
	        	bindShowDateEvent();
	        	//显示排期
	        	getFilmShowByDate($('#showDateBtnBox a').first());
	        }
	    }); 
    }
    //切换日期选择
    function dateChoose(){
		$('.film-date-wrapper a').click(function(){
			$('.film-date-wrapper a').removeClass('current');
			$(this).addClass('current');
			var datewidth=$('.film-date-wrapper a').width(); 
            var dateindex=$(this).index();
            $('.film-date-wrapper .underline').css({'width':(datewidth),'left':datewidth*dateindex+6});
		})
	};
    
    //根据日期获取影片排期
    function getFilmShowByDate(target){
    	$('#showDateBtnBox a').removeClass("current");
    	$(target).addClass("current");
     	var index = $(target).attr("data-index");      
		var showDate = $(target).attr("data-date");
    	getFilmShow(showDate,index);
	}
    
    //生成场次列表
	function renderView(filmList){
		var filmListRender = template.compile(filmListTem);
		var filmListHtml = filmListRender(filmList);
		document.getElementById("film_show").innerHTML=filmListHtml;
	}
    
  	//获取影片排期
    function getFilmShow(queryShowData,index){
//    	console.log(queryShowData);
    	//传入不同的日期作为参数，发送请求
    	var param = {};
    	if(index == 0){
    		$.ajax({
	    		type:"get",
	    		url:"filminfo1.json",
	    		data: param,
	    		dataType:'json',
	    		success: function(result){
			    	renderView(result);
		    	}
	    	});
    	}else if(index == 1){
    		$.ajax({
	    		type:"get",
	    		url:"filminfo2.json",
	    		data: param,
	    		dataType:'json',
	    		success: function(result){
			    	renderView(result);
		    	}
	    	});
    	}else if(index == 2){
    		$.ajax({
	    		type:"get",
	    		url:"filminfo3.json",
	    		data: param,
	    		dataType:'json',
	    		success: function(result){
			    	renderView(result);
		    	}
	    	});
    	}else if(index == 3){
    		$.ajax({
	    		type:"get",
	    		url:"filminfo4.json",
	    		data: param,
	    		dataType:'json',
	    		success: function(result){
			    	renderView(result);
		    	}
	    	});
    	}
    	
    }

    function chooseShow(cinemaId,showId,filmId,showdate,starttime,hallName,edition){
    	var timeStart = new Date(showdate);//影片开始时间
    	var timeNow = new Date();//当前时间
    	window.location = path+"/myfilmapp/selectseat.html?cinemaid="+cinemaId+"&showid="+showId+"&filmid="+filmId+"&showdate="+showdate+"&starttime="+starttime+"&hallname="+hallName+"&edition="+edition;
    }
    
   
    exports.initFilmShowHeader = initFilmShowHeader; 
    exports.getFilmShowByDate = getFilmShowByDate;
    exports.getFilmShow = getFilmShow;
    exports.chooseShow = chooseShow;
    return exports;
})(fastView||{});