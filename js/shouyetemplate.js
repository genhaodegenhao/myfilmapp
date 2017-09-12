template.config('openTag','<#');
template.config('closeTag','#>');

var mySwiper = new Swiper('.swiper-container', {
	autopaly: 3000,
	pagination : '.swiper-pagination',
});
$(document).ready(function(){
	loadFilmList();
	var ciname = window.localStorage.getItem('ciname');
//	var ciaddress = window.localStorage.getItem('ciaddress');
	$('.cinemaname .name').text(ciname);
})
function loadFilmList(index){
	if(index == 1 || index == undefined){
		$.ajax({
			type:"get",
			url:"hotfilm.json",
			async:true,
			success: function(result){
				if(result.status == 0){
					renderFilm(result);
				}
			}
		});
	}else if(index ==2){
		$.ajax({
			type:"get",
			url:"commingfilm.json",
			async:true,
			success: function(result){
				if(result.status == 0){
					renderFilm(result);
				}
			}
		});
	}
}
//点击切换热映/即将上映影片
$(".tbarul .same").click(function(){
	$(".film_show ul").eq($(this).index()-1).addClass("show").siblings().removeClass("show");
	$(this).addClass("active").siblings().removeClass("active");
	loadFilmList($(this).index());
})

//影片列表
var filmListTem = '<#for(var i=0;i<data.length;i++) {#>'+
					'<#var filmList = data[i]; #>'+
					'<li class="showinfolist">'+
					'<div class="filmimg"><img src="<#=filmList.film.mainposter.url#>"/></div>'+
					'<div class="filminfo"><p class="filmname"><#=filmList.film.name#></p><p class="filmdesc"><#=filmList.film.summary#></p><p class="filmedition"><#=filmList.film.type#></p></div>'+
					'<div onClick="toBuyNext(\'<#=filmList.film.name#>\')" class="tobuy">点击购买</div>'+
				'</li>'+
				'<#}#>';
//加载影片
function renderFilm(result){
	var filmListRender = template.compile(filmListTem);
	var filmListHtml = filmListRender(result);
	document.getElementById("hotfilm").innerHTML = filmListHtml;
}

//点击购买进行下一步
function toBuyNext(filmname){
	window.localStorage.setItem('val',filmname);
	window.location = 'showlist.html';
}

//切换影院名称和地址
$('.cinemaname').click(function(){
	$('#cinemaList').show();
	$('#showWraper').hide();
	$.ajax({
		type:"get",
		url:"cinemalist.json",
		async:true,
		success: function(result){
			if(result.status == 0){
				renderCinema(result);
			}
		}
	});
	
});
$('.showFilmList').click(function(){
	$('#cinemaList').hide();
	$('#showWraper').show();
})

//加载影院列表数据模板
var cinemaListTem = '<ul class="cinema_list">'+
						'<#for(var i=0;i<data.length;i++){ #>'+
							'<#var cinemaInfo = data[i]; #>'+
							'<li class="cinema_item" onclick="chooseCinema(\'<#=cinemaInfo.cinema.name#>\',\'<#=cinemaInfo.address#>\')" >'+
								'<p class="cinema_name fzl"><#=cinemaInfo.cinema.name#></p>'+
								'<p class="cinema_address fzs"><#=cinemaInfo.address#></p>'+
								'<img src="<#=basePath#>/seat/images/cinema_link.png" class="oper_arrow" />'+
							'</li>'+
						'<#}#>'+
					'</ul>';
function renderCinema(result){
	var cinemaList = template.compile(cinemaListTem);
	var cinemaListHtml = cinemaList(result);
	document.getElementById("cinemaListInfo").innerHTML = cinemaListHtml;
}
//切换显示影院信息
function chooseCinema(ciname,ciaddress){
	window.localStorage.setItem('ciname',ciname);
	window.localStorage.setItem('ciaddress',ciaddress);
	window.location.reload();
}








