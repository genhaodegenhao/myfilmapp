/**********************************************
*	seat 座位控件
*	@parameters 
*		
**********************************************/
;(function($){
	var myScroll;
    var row, col;
	var hsbar,vsbar,hul,vul,seatmap,scroller,mapUl,seattable,errorBox,errorText;
	function init(target,param){
		$(target).addClass("uiseat");
		//初始化dom
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		seatmap=$(".seatmap",target);
		if(!seatmap.length){
			seatmap=$('<div class="seatmap" id="seatmap"><div class="scroller"></div></div>');
			seatmap.appendTo(target);
		}
		scroller=$(".scroller",seatmap);
		if(!scroller.length){
			scroller=$('<div class="scroller"></div>');
			scroller.appendTo(seatmap);
		}
		errorBox=$(".errorbox",target);
		if(!errorBox.length){
			errorBox=$('<table width="100%" height="100%" class="errorbox"><tr><td><p class="errorText"></p></td></tr></div>');
			errorBox.appendTo(target);
		}
		errorText=$(".errorText",errorBox);
		mapUl=$("ul",scroller);
		if(!mapUl.length){
			mapUl=$('<ul></ul>').appendTo(scroller);
		}
		hsbar=$("div.hsbar",target);
		if(!hsbar.length){
			hsbar=$('<div class="hsbar"><ul></ul></div>');
			hsbar.appendTo(target);
		}
		vsbar=$("div.vsbar",target);
		if(!vsbar.length){
			vsbar=$('<div class="vsbar"><ul></ul></div>');
			vsbar.appendTo(target);
		}
		hul=$("ul",hsbar);
		vul=$("ul",vsbar);
		if(!hul.length){
			hul=$('<ul>');
			hul.appendTo(hsbar);
		}
		if(!vul.length){
			vul=$('<ul>');
			vul.appendTo(vsbar);
		}
		loadAllSeats(target,param);
	}
	function update(target,data){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		opts.selected=[];
		if(data.status===0){
			opts.data=seatTo2D(data.data[0].seats);
//			opts.activitydata=data.activitydata;
			drawView(target,opts.data);
		}else{
			showError(target,data.msg);
		}
	}
	function updateData(target,data){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
	}
	function updataView(target){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var width=$(seatmap).width();
		var seatWidth=width/col;
		var seatHeight=seatWidth;
		vsbar.css("width",seatWidth);
		$("li",hul).css({"line-height":seatHeight+"px","height":seatHeight+"px","width":seatWidth+"px","font-size":seatWidth*2/3+"px"});
		$("li",vul).css({"height":seatHeight,"line-height":seatHeight+"px","font-size":seatHeight*2/3+"px"});
		$("li",scroller).css("height",seatHeight);
		$("li span",scroller).css({"width":seatWidth-2,"height":seatWidth-2});
		var seatAreaH=seatmap.height();
		if(opts.dis){
			$(target).css("height",opts.dis*2+seatAreaH);
			vsbar.css({"top":opts.dis+"px"});
			seatmap.css({"paddingTop":opts.dis+"px","paddingBottom":opts.dis+"px"});
		}else{
			vsbar.css({"top":"45px"});
			seatmap.css({"paddingTop":"45px","paddingBottom":"45px"});
			$(target).css("height",45*2+seatAreaH);
		}
	}
	function showError(target,msg){
		errorText.text(msg);
		seatmap.hide();
		errorBox.show();
	}
	function drawView(target,data){
		seatmap.show();
		errorBox.hide();
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		col=getCol(target);
		row=getRow(target);
		var width=$(seatmap).width();
		var seatWidth=width/col;
		var seatHeight=seatWidth;
		vsbar.css("width",seatWidth);
		hul.text("");
		vul.text("");
		mapUl.text("");
		var arr = [];
		var arrs = [];
		if(isSequence(target)){
			for(var i=0;i<col;i++){
				var hli=$('<li></li>').css({"line-height":seatHeight+"px","height":seatHeight+"px","width":seatWidth+"px","font-size":seatWidth*2/3+"px"});
				hli.appendTo(hul);
				hli.text(i+1);
			}
		}else{
			for(var i=col-1;i>=0;i--){
				var hli=$('<li></li>').css({"line-height":seatHeight+"px","height":seatHeight+"px","width":seatWidth+"px","font-size":seatWidth*2/3+"px"});
				hli.appendTo(hul);
				hli.text(i+1);
			}
		}
		for(var i=0;i<row;i++){
			var li=$("<li></li>");
			li.css("height",seatHeight);
			li.appendTo(mapUl);
			for(var j=0;j<col;j++){
				var node=$('<span class=""></span>').css("width",seatWidth-2).css("height",seatWidth-2);
				var seat=$('<em class="seaticon"></em>');
				seat.appendTo(node);
				node.appendTo(li);
			}
		}
		for(var i=0;i<opts.data.length;i++){
			var rd=opts.data[i];
			var vli=$('<li></li>').css({"height":seatHeight,"line-height":seatHeight+"px","font-size":seatHeight*2/3+"px"});
			var ul=$("ul",scroller);
			var li=$("li:eq("+i+")",ul);
			vli.appendTo(vul);
			if(rd.length>0 && rd[0]){
				vli.text(rd[0].row_name);
				li.attr("row",rd[0].row_name);
			}
			for(var j=0;j<rd.length;j++){
				var coord_x=rd[j].coord_x-1;
				var seat=$("span:eq("+coord_x+")",li);
				var seatid = rd[j].id;
				arrs.push(seatid);
				if(rd[j]){
					seat.attr("col",rd[j].col_name);
					seat.attr("row",rd[j].row_name);
					seat.attr("data",rd[j].coord_y+"-"+rd[j].coord_x+"-"+rd[j].row_name+"-"+rd[j].col_name);
					if(rd[j].available===0){
						seat.addClass("available_seat");
						//特殊座位处理
//						var isactivity=isActivitySeat(target,opts,rd[j].seat);
//						if(isactivity){
//							seat.addClass("activityseat");
//						}
					}else if(rd[j].available===1){
						seat.addClass("unavailable_seat");
					}
//		判断座位类型
//					if(rd[j].type==="W"){
//						seat.addClass("sold");
//					}
				}
			}
		}
		refesh(target);
	}
	function isActivitySeat(target,opts,s){
		if(opts.activitydata==null||opts.activitydata==undefined){
			return false;
		}
		if(opts.activitydata.length<1){
			return false;
		}
		for(var i=0;i<opts.activitydata.length;i++){
			if(s.col_name==opts.activitydata[i].orderseat.col_name && s.row_name==opts.activitydata[i].orderseat.row_name){
				return true;
			}
		}
		return false;
	}
	function updateView(target){
		//var tbar=$("div.tbar",target);
		var header=$("div.header",target);
		var allcity=$("div.allcity",target);
		var broserHeight=$(window).height();
		var topHeight=header.height()-0+16;
		var cityLsHeight=broserHeight-topHeight;
		allcity.height(cityLsHeight);
		loadAllCity(target);
	}
	function isSequence(target){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var i=0;
		while(i<opts.data[i].length){
			if(opts.data[i].length>=2){
				return opts.data[i][0].col_name < opts.data[i][1].col_name;
			}
		}
		return true;
	}
	function getRow(target){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		return opts.data.length;
	}
	function getCol(target){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var col=0;
		for(var i=0;i<opts.data.length;i++){
			var rd=opts.data[i];
			if(rd.length>0){
				var coord_x=rd[rd.length-1].coord_x;
				if(coord_x>col){
					col=coord_x;
				}
			}
		}
		return col;
	}
	function loadAllSeats(target,param){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		param=param||{};
		if(opts.url){
			//$("#log").append(" start loadData->");
			$.ajax({
				type: "GET",
				url:opts.url,
				crossOrigin: true,
				data:param,
				dataType:"json",
				success: function(result){
					update(target,result);
//					$.fn.seat.defaults.onLoadDataComplet(target,result);
				},
				error:function(result){
					showError(target,"抱歉，无法连接到网络！");
				}
			});
		}else if(opts.data.length>0){
			update(target,opts.data);
		}		
	}
	function reloadAllSeat(target,param){
		loadAllSeats(target,param);
	}
	function refesh(target){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var seatAreaH=seatmap.height();
		if(opts.dis){
			$(target).css("height",opts.dis*2+seatAreaH);
			vsbar.css({"top":opts.dis+"px"});
			seatmap.css({"paddingTop":opts.dis+"px","paddingBottom":opts.dis+"px"});
		}else{
			vsbar.css({"top":"45px"});
			seatmap.css({"paddingTop":"45px","paddingBottom":"45px"});
			$(target).css("height",45*2+seatAreaH);
		}
		mysroll();
	}
	function _zoom(target,param){
		$("#log").append("zoom");
		myScroll.zoom(3);
	}
	function mysroll() {
        myScroll = new IScroll(".uiseat", {
            zoom: true,
            scrollX: true,
            scrollY: true,
            mouseWheel: true,
            wheelAction: 'zoom'
        });
		//console.info(myScroll);
    }
	function bindEvent(target){
        setTimeout(mysroll, 200);
       /* $(el).find('i').bind("tap", function () {
            bindchos(this);
        });*/
		$(window).resize(function(){
			updataView(target);
		});
		$(target).unbind().bind('click',function(e){
			//如果点击的是：letter
			var tt=e.target;
			var clazz=$(tt).attr("class");
			if($(tt).hasClass("seatmap")){
				//_zoom(target,4);
			}else if($(tt).hasClass("seaticon")){
				
				//$("#log").append(" available_seat clicked! ");
				
				//var pcell=$(tt).parent();
				//var prow=pcell.parent();
				var pcell=$(tt).parent();
				if(pcell.is(".unavailable_seat")){
					return;
				}
				var prow=pcell.parent();
				var coord_x=pcell.index()-0;
				var coord_y=prow.index()-0;
				var rowName=pcell.attr("row");
				var colName=pcell.attr("col");
				var seat=getSeatData(target,coord_y,coord_x,rowName,colName);
				if(pcell.is(".activityseat")){
					seat.activityseat=true;
				}else{
					seat.activityseat=false;
				}
				if(pcell.is(".selected")){
					unselectSeat(target,seat);
				}else{
					/*判断是否可以选择*/
					selectSeat(target,seat);
				}
			}
		});
	}
	
	function isCanselected(target,param,model){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var selectedSeats=$.extend([],opts.selected);
		
		if(model==1){
			//添加
			if(opts.selected.length>=6){
				return 2;
			}
			selectedSeats.push(param);
		}else{
			//取消
			selectedSeats=removeSeatFromArray(target,selectedSeats,param);
		}
		var result=checkSelectedRule(target,selectedSeats,param);
		return result;
	}
	function checkSelectedRule(target,selectedSeats,current){
		var status=0;
		if(selectedSeats.length<1){
			return status;
		}else if(selectedSeats.length==1){
			//return isOneCanSelect(target,selectedSeats[0].seat);
			return checkOneSelectedRule(target,selectedSeats,current);
		}else{
			while(selectedSeats.length>0){
				var row=[];
				var so=selectedSeats[0];
				row.push(so);
				
				for(var i=1;i<selectedSeats.length;i++){
					var temp=selectedSeats[i];
					if(temp.coord_y==so.coord_y){
						row.push(temp);
					}
				}
				for(var j=0;j<row.length;j++){
					selectedSeats=removeSeatFromArray(target,selectedSeats,row[j]);
				}
				if(row.length==1){
					status=checkOneSelectedRule(target,row,current);
				}else if(row.length>1){
					status=checkManySelectedRule(target,row,current);
				}
				if(status>0){
					return status;
				}
			}
		}
		return status;
	}
	function checkOneSelectedRule(target,row,current){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var seat=getSeat(target,row[0].coord_y-1,row[0].coord_x-1);
		if(seat.next().length>0){
			if(seat.next().is(".available_seat")){
				if(seat.next().next().length>0){
					if(seat.prev().length<1 || seat.prev().is(".unavailable_seat")||seat.prev().attr("class")==""){
						return 0;
					}
					if(seat.next().next().is(".unavailable_seat")){
						return 1;
					}
					if(seat.next().next().first().attr("class")==""){
						return 1;
					}
				}else{
					if(seat.prev().is(".unavailable_seat")||seat.prev().attr("class")==""){
						return 0;
					}
					return 1;
				}
			}
		}else{
			return 0;//最后一个可选
		}
		//判断前面元素，
		if(seat.prev().length>0){
			if(seat.prev().is(".available_seat")){
				if(seat.prev().prev().length>0){
					if(seat.next().length<1 || seat.next().is(".unavailable_seat")||seat.next().attr("class")==""){
						return 0;
					}
					if(seat.prev().prev().is(".unavailable_seat")){
						return 1;
					}
					if(seat.prev().prev().attr("class")==""){
						return 1;
					}
				}else{
					if(seat.next().is(".unavailable_seat")||seat.next().attr("class")==""){
						return 0;
					}
					return 1;
				}
			}
		}else{
			return 0;//第一个可选
		}
		return 0;
	}
	function checkManySelectedRule(target,row,current){
		row=sortSeatByCol(row);
		//var seat=row[0].seat;
		var ri=row[0].coord_y-1;
		var minci=row[0].coord_x - 1;
		var maxindex=row.length-1;
		var maxci=row[maxindex].coord_x - 1;
		if(current.coord_y-1==ri&&current.coord_x-1 >minci&& current.coord_x-1 < maxci){
			return 1;
		}
		for(var i=minci + 1;i < maxci;i++){
			var temp=getSeat(target,ri,i);
			if(temp.is(".available_seat.selected")){
				//已选座位
			}else if(temp.is(".available_seat")){
				return 1;
			}
		}
		return 0;
	}
	
	//获取座位数据
	function getSeatData(target,ri,ci,rn,cn){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		
		if(ri >= opts.data.length){
			return {};
		}
		var rd=opts.data[ri];
		var i=0;
		while (i<rd.length){
			if(rd[i].col_name===cn){
				return rd[i];
			}
			i++;
		}
		return {};
	}
	//获取座位对象
	function getSeat(target,ri,ci){
		//var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var li=mapUl.children("li").eq(ri);
		var seat=li.children("span").eq(ci);
		return seat;
	}
	function getSelected(target,param){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		return opts.selected;
	}
	function removeSeatFromArray(target,array,param){
		if(param){
			for(var i=0;i<array.length;i++){
				if(array[i].coord_x==param.coord_x&&array[i].coord_y==param.coord_y){
					array.splice(i,1);
				}
			}
		}
		return array;
	}
	function removeSeat(target,param){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var selectSeats=opts.selected;
		if(param){
			var cs=$("span[row="+param.row_name+"][col="+param.col_name+"]",mapUl);
			if(cs.length>0){
				$(".available_seat",cs).removeClass("selected");
			}
			for(var i=0;i<opts.selected.length;i++){
				if(opts.selected[i].coord_x==param.coord_x&&opts.selected[i].coord_y==param.coord_y){
					opts.selected.splice(i,1);
				}
			}
		}
	}
	function addSeat(target,param){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		opts.selected.push(param);
		var $seat =getSeat(target,param.coord_y-1,param.coord_x-1);
		$seat.addClass("selected");
	}
	function selectSeat(target,param){
		var status=isCanselected(target,param,1);
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		//var status=isCanSelect(target,coord_y,coord_x,rowName,colName);
		if(status>0){
			if(status==1){
				$.FloatingHint({"id":"FLOATINGHINT","holdTime":1000,"text":"亲不能跳选哦！"});
				//alert("亲不能跳选哦！");
			}else{
				$.FloatingHint({"id":"FLOATINGHINT","holdTime":1000,"text":"亲最多选择6个座位哦！"});
				//alert("亲最多选择6个座位哦");
			}
			return;
		}
		addSeat(target,param);
		//seat =getSeat(target,param.coord_y-1,param.coord_x-1);
		$.fn.seat.defaults.onSeatSelected(target,param);
	}
	function unselectSeat(target,param){
		var opts=$.fn.seat.methods["getOptions"](target,"seat");
		var status=isCanselected(target,param,0);
		if(status>0){
			if(status==1){
				$.FloatingHint({"id":"FLOATINGHINT","holdTime":1000,"text":"亲不能跳选哦！"});
				//alert("亲不能跳选哦！");
			}
			return;
		}
		seat =getSeat(target,param.coord_y-1,param.coord_x-1);
		seat.removeClass("selected");
		removeSeat(target,param);
		$.fn.seat.defaults.onSeatUnselected(target,param);
	}
	$.extend($.fn,{
		seat:function(options,param){
			if (typeof options == 'string'){
				return $.fn.seat.methods[options](this, param);
			}
			options = options || {};
			return this.each(function(){
				var state = $.data(this,'seat');
				if (state){
					$.data(this,'seat',{
						options:$.extend(state.options, options)
					});
				} else {
					$.data(this, 'seat', {
						options: $.extend({},$.fn.base.defaults,$.fn.seat.defaults,options)
					});
				}
				init(this,param);
				bindEvent(this);
			});
		}
	});
	$.fn.seat.methods = $.extend({},$.fn.base.methods,{
		update:function(jq,param){
			return jq.each(function(){
				update(this,param);
			});
		},
		reload:function(jq,param){
			//return jq.each(function(){
				//var _this=this;
			return reloadAllSeat(jq[0],param);
			//});
		},
		zoom: function (jq, param) {
            _zoom(jq, param);
        },
		getSelected:function(jq,param){
			return	getSelected(jq[0],param);
		},
		unselectSeat:function(jq,param){
			return unselectSeat(jq[0],param);
		}
	});
	$.fn.seat.defaults =$.extend({},$.fn.base.defaults,{
		name:"seat",
		width:"",
		height:"",
		dis:48,
		maxSelected:6,
		activitydata:[],
		uiname:"seat",
		url:"newseats.json",
		data:[],
		selected:[],
		onSelected:function(target,data){alert("选择了："+data.city.name);},
		onSeatSelected:function(target,data){
			var seats=$("#seat").seat("getSelected");
			alert("选择了座位:"+data.row_name+"排 "+data.col_name+"座");
			console.info(data.seat);
			console.info(seats);
		},
		onSeatUnselected:function(target,data){
			var seats=$("#seat").seat("getSelected");			
			alert("取消了座位:"+data.row_name+"排 "+data.col_name+"座");
			console.info(data.seat);
			console.info(seats);
		},
		onLoadDataComplet:function(target,data){}
	});
})(jQuery);