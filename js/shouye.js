var mySwiper = new Swiper('.swiper-container', {
	pagination : '.swiper-pagination',
});
$(document).ready(function(){
	loadFilmList();
})
function loadFilmList(index){
	if(index == 1 || index == undefined){
		$.ajax({
			type:"get",
			url:"hotfilm.json",
			async:true,
			success: function(result){
				for (var i = 0; i < result.data.length; i++) {
					var ullist = $('#hotfilm');
					var oli = $('<li class="showinfolist">'+
					'<div class="filmimg"><img src="'+result.data[i].film.mainposter.url+'"/></div>'+
					'<div class="filminfo"><p class="filmname">'+result.data[i].film.name+'</p><p class="filmdesc">'+result.data[i].film.summary+'</p><p class="filmedition">'+result.data[i].film.type+'</p></div>'+
					'<div class="tobuy">点击购买</div>'+
					'</li>');
					oli.appendTo(ullist);
				}
			}
		});
	}else if(index ==2){
		$.ajax({
			type:"get",
			url:"commingfilm.json",
			async:true,
			success: function(result){
				for (var i = 0; i < result.data.length; i++) {
					var ullist = $('#goingfilm');
					var oli = $('<li class="showinfolist">'+
					'<div class="filmimg"><img src="'+result.data[i].film.mainposter.url+'"/></div>'+
					'<div class="filminfo"><p class="filmname">'+result.data[i].film.name+'</p><p class="filmdesc">'+result.data[i].film.summary+'</p><p class="filmedition">'+result.data[i].film.type+'</p></div>'+
					'<div class="tobuy">点击购买</div>'+
					'</li>');
					oli.appendTo(ullist);
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