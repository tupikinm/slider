$(function(){

var flag = false;
var speed = 1000;
var w = 700;
var h = 500;
var ww = 500;
var hh = 300;
var i;
var slides = new Array();

function setpn(){
	if($('.slide-prev').get(0) == undefined)
	{
		if($('.slide-left').prev('.slide').get(0) != undefined)
			$('.slide-left').prev('.slide').removeClass('slide').addClass('slide-prev');
		else
			$('.slide:last').removeClass('slide').addClass('slide-prev');
	}
	if($('.slide-next').get(0) == undefined)
	{
		if($('.slide-right').next('.slide').get(0) != undefined)
			$('.slide-right').next('.slide').removeClass('slide').addClass('slide-next');
		else
			$('.slide:first').removeClass('slide').addClass('slide-next');
	}
	
	$('.slides>div').attr('style','');
	flag = false;
	if($('.slide-right').get(0) == $('.slides>div:last').get(0)) { $('.slide-next').css({marginRight: '-'+ww+'px'}); }
	if($('.slide-prev').get(0) == $('.slides>div:last').get(0)) { $('.slide-prev').css({marginLeft: '-'+2*ww+'px'}); }
	
	setgrey([$('.slide-prev'),$('.slide-next')], false);
	
	$('.slide-left').unbind('click').click(function(){ $('.arrow-left').trigger('click'); });
	$('.slide-right').unbind('click').click(function(){ $('.arrow-right').trigger('click'); });
}

var j = 0;

function imgload(){
	if(j>i) return;
	var img = new Image();
	img.src = slides[j].getAttribute('src');
	img.onload = function(){
		slides[j].appendChild(img);
		if (j==i) { setcls(); return false; }
		j++; 
		imgload();
	}
}

function init(){
	//Размер блока со стрелками
	var p = $('.slides').parent();
	$('<div id="arrows"><div class="arrow-left"></div><div class="arrow-right"></div></div>').prependTo(p);
	$('#arrows').css({marginLeft: '-'+w/2+'px',	width:w+'px', height:h+'px'});

	//Скрываем панель слайдов до загрузки изображений
	$('.slides').css({opacity:'0'});
	
	//Определяем количество элементов для определения загруженности картинок
	$('.slide').each(function(){ slides.push(this); });
	i = slides.length - 1;
	imgload();
}


function setgrey(obj, rev){
	for(i=0;i<obj.length;i++){
		var im = obj[i].find('img');
		obj[i].find('.gsWrapper').remove();
		im.appendTo(obj[i]);
		//obj[i].get(0).appendChild(im.get(0));
		var img = im.get(0);
		img.width = rev ? w : ww;
		img.height = rev ? h : hh;
		try {
		$(img).greyScale({
          	fadeTime: 0,
          	reverse: rev
        }); } catch(e){}
    }
}

function setcls() {	
	//Расставляем классы
	var prev = $(slides[slides.length-1]);
	var left = $(slides[0]);
	var center = $(slides[1]);
	var right = $(slides[2]);
	var next = $(slides[3]);
	prev.removeClass('slide').addClass('slide-prev');
	left.removeClass('slide').addClass('slide-left');
	center.removeClass('slide').addClass('slide-center');
	right.removeClass('slide').addClass('slide-right');
	next.removeClass('slide').addClass('slide-next');
	
	left.click(function(){ $('.arrow-left').trigger('click'); });
	right.click(function(){ $('.arrow-right').trigger('click'); });

	setgrey([prev,left,right,next], false);
	setgrey([center], true);
	center.find('span').css({display:'block',opacity:'1'});
	 
	//Отображаем панель слайдов
	$('.slides').animate({opacity:'1'});

	$('.arrow-right').click(function(){
		if(flag) return; flag = true; //отменяем возможность клика пока не закончилась анимация
		
		var left = $('.slide-left');
		var center = $('.slides>.slide-center');
		var right = $('.slide-right');
		var prev = $('.slide-prev');
		var next = $('.slide-next');
		
		center.find('span').hide();
		center.animate({	width: ww+'px', 
							marginLeft:'0px', 
							left:'0%', 
							height:hh+'px', 
							marginTop:'100px'
						}, speed, function(){
												$(this).removeClass('slide-center').addClass('slide-left').attr('style',''); 
											});
						
		prev.removeClass('slide-prev').addClass('slide');
		
		left.animate({marginLeft:'-'+ww+'px'}, speed, function(){ $(this).removeClass('slide-left').addClass('slide-prev').attr('style',''); });
		next.animate({marginRight: '0px' }, speed, function(){ $(this).removeClass('slide-next').attr('style','').addClass('slide-right'); });
		right.css({position: 'relative', zIndex:'20', right: '0%'}).animate({	marginRight:'-'+w/2+'px', 
																right:'50%', 
																width:w+'px', 
																height:h+'px', 
																marginTop:'0'
															}, speed, function(){ $(this).removeClass('slide-right').addClass('slide-center').attr('style','').find('span').fadeIn(); setpn(); });
	
		//изменяем размер обесцвеченных картинок и возвращаем им цвет
		var img = right.find('img');
		$(img).animate({width:w+'px', height:h+'px'}, speed,
		function(){
			if ($.browser.msie) {
      			// фиксим эксплорер
       			$(img).css({
          		'filter': 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)'
        	});
		}
		});
		right.find('.gsCanvas').animate({width:w+'px', height:h+'px', opacity:'0'}, speed);
		
		
		//обесцвечиваем центральную и уменьшаем картинку
		var cimg = center.find('img');
		cimg.appendTo(center);
		cimg.animate({width:ww+'px', height:hh+'px'}, speed);
		center.find('.gsWrapper').remove();
		cimg.greyScale({
          	fadeTime: speed,
          	reverse: false
        });
        center.find('.gsCanvas').animate({width:ww+'px', height:hh+'px'},{queue: false, duration:speed});
		
	});
	$('.arrow-left').click(function(){
		if(flag) return; flag = true; //отменяем возможность клика пока не закончилась анимация
		
		var left = $('.slide-left');
		var center = $('.slide-center:first');
		var right = $('.slide-right');
		var prev = $('.slide-prev');
		var next = $('.slide-next');
		
		center.find('span').hide();
		center.animate({	width:ww+'px', 
							left:'100%', 
							marginLeft:'-'+ww+'px', 
							height:hh+'px', 
							marginTop:'100px'
						}, speed, function(){ $(this).removeClass('slide-center').addClass('slide-right'); });
		
		next.removeClass('slide-next').addClass('slide');
		var ml = w/2;
		var mp = 0;
		if($('.slide-prev').get(0) == $('.slides>div:last').get(0)) 
		{

		}
		left.css({position:'absolute', zIndex:'20'}).animate({	marginLeft:'-'+ml+'px',
																left:'50%',
																width:w+'px',
																height:h+'px',
																marginTop:'0'
															}, speed, function(){ $(this).removeClass('slide-left').addClass('slide-center').attr('style','').find('span').fadeIn(); });
		
		prev.css({marginLeft:'-'+ww+'px'}).animate({marginLeft: mp+'px' }, speed, function(){ $(this).removeClass('slide-prev').addClass('slide-left'); });
		right.animate({marginRight:'-'+ww+'px'}, speed, function(){ $(this).removeClass('slide-right').addClass('slide-next'); setpn();});
	
		//изменяем размер обесцвеченных картинок и возвращаем им цвет
		var img = left.find('img');
		$(img).animate({width:w+'px', height:h+'px'}, speed, 
		function(){
			if ($.browser.msie) {
      			// фиксим эксплорер
       			$(img).css({
          		'filter': 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)'
        	});
		}
		});
		left.find('.gsCanvas').animate({width:w+'px', height:h+'px', opacity:'0'}, speed);
		
		//обесцвечиваем центральную и уменьшаем картинку
		var cimg = center.find('img');
		cimg.appendTo(center);
		cimg.animate({width:ww+'px', height:hh+'px'}, speed);
		center.find('.gsWrapper').remove();
		cimg.greyScale({
          	fadeTime: speed,
          	reverse: false
        });
        center.find('.gsCanvas').animate({width:ww+'px', height:hh+'px'},{queue: false, duration:speed});
	});
}	
//setInterval(function(){ $('.arrow-right').trigger('click'); }, 9000);

init();
	
});
