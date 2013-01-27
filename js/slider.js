$(function(){

var flag = false;
var speed = 1000;
var w = 700;
var h = 500;
var ww = 500;
var hh = 300;
var i;
var slides = [];
var canslide = '';
var win = window;
var d = document;
	d.g = document.getElementById;
var cursor = '';

//Клики по крайним картинкам
document.onclick = function(e){
	var trg = e.target||e.toElement;
	var cls = trg.parentNode.parentNode.className;
	if(cls.indexOf('slide-') != -1) {
		var id = 'arrow'+cls.replace('slide','').replace('pointer','').replace(/[\s]+/g, '');
		var evt = d.createEvent('MouseEvents');
		evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		if(d.g(id) != undefined)
			d.g(id).dispatchEvent(evt);
	}
}

function setpn(){
	if($('.slide-prev').get(0) == undefined)
	{
		var lprv = $('.slide-left').prev('.slide').get(0);
		if(lprv != undefined)
			lprv.className = 'slide-prev';
		else {
			var sl = $('.slide:last').get(0);
			if(sl != undefined)
				sl.className = 'slide-prev';
		}
	}
	if($('.slide-next').get(0) == undefined)
	{
		var rnxt = $('.slide-right').next('.slide').get(0);
		if(rnxt != undefined)
			rnxt.className = 'slide-next';
		else {
			var sf = $('.slide:first').get(0);
			if(sf != undefined)
				sf.className = 'slide-next';
		}
	}
	
	$('.slides>div').attr('style','');
	flag = false;
	if($('.slide-right').get(0) == $('.slides>div:last').get(0)) { $('.slide-next').css({marginRight: '-'+ww+'px'}); }
	if($('.slide-prev').get(0) == $('.slides>div:last').get(0)) { $('.slide-prev').css({marginLeft: '-'+2*ww+'px'}); }
	
	setgrey([$('.slide-prev'),$('.slide-next')], false);
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

(function(){

	//Скрываем панель слайдов до загрузки изображений
	$('.slides').css({opacity:'0'});
	
	//Определяем количество элементов для определения загруженности картинок
	$('.slide').each(function(){ slides.push(this); });
	i = slides.length - 1;
	
	//Размер блока со стрелками
	if(i>=3){
		var p = $('.slides').parent();
		$('<div id="arrows"><div id="arrow-left"></div><div id="arrow-right"></div></div>').prependTo(p);
		$('#arrows').css({marginLeft: '-'+w/2+'px',	width:w+'px', height:h+'px'});
		cursor = 'pointer';
	}
	
	imgload();
	
	document.close();
})();


function setgrey(obj, rev){
	for(i=0;i<obj.length;i++){
	if(obj[i] == undefined) continue;
		var im = $(obj[i]).find('img');
		$(obj[i]).find('.gsWrapper').remove();
		im.appendTo(obj[i]);
		var img = im.get(0);
		if(img != undefined) {
			img.width = rev ? w : ww;
			img.height = rev ? h : hh;
		try {
			$(img).greyScale({
    		  	fadeTime: 0,
     	   	 	reverse: rev
     	  	}); } catch(e){}
    	}
    }
}

function setcls() {	
	//Расставляем классы
	var left = slides[0];
	var center = slides[1];
	var right = slides[2];
	if(slides.length >=4){
		var next = slides[3];
		next.className = 'slide-next';
	}
	if(slides.length > 4){
		var prev = slides[slides.length-1];
		prev.className = 'slide-prev';
	}
	left.className = 'slide-left '+cursor;
	center.className = 'slide-center';
	right.className = 'slide-right '+cursor;

	setgrey([prev,left,right,next], false);
	setgrey([center], true);
	$(center).find('span').css({display:'block',opacity:'1'});
	 
	//Отображаем панель слайдов
	$('.slides').animate({opacity:'1'});

	d.g('arrow-right').onclick = function(){
		if(flag) return; flag = true; //отменяем возможность клика пока не закончилась анимация
		
		if(check_slides('right')) return; //проверка по количеству слайдов				
	
		$('.slide-left').animate({marginLeft:'-'+ww+'px'}, speed, function(){ this.className = 'slide-prev'; this.setAttribute('style',''); });
		$('.slide-next').animate({marginRight: '0px' }, speed, function(){ this.className = 'slide-right '+cursor; this.setAttribute('style',''); });
		$('.slide-right').css({position: 'relative', zIndex:'20', right: '0%'}).animate({	marginRight:'-'+w/2+'px', 
																right:'50%', 
																width:w+'px', 
																height:h+'px', 
																marginTop:'0'
															}, speed, function(){ 
																					this.className = 'slide-center';
																					this.setAttribute('style','');
																					$(this).find('span').fadeIn(); 
																					setpn(); 
																				});
		moving('right');
		
	};
	d.g('arrow-left').onclick = function(){
		if(flag) return; flag = true; //отменяем возможность клика пока не закончилась анимация
		
		if(check_slides('left')) return; //проверка по количеству слайдов
		
		$('.slide-right').animate({marginRight:'-'+ww+'px'}, speed, function(){ this.className = 'slide-next'; this.setAttribute('style',''); });
		$('.slide-prev').css({marginLeft:'-'+ww+'px'}).animate({marginLeft: '0px' }, speed, function(){ this.className = 'slide-left '+cursor; this.setAttribute('style',''); });
		$('.slide-left').css({position:'absolute', zIndex:'20'}).animate({	marginLeft:'-'+w/2+'px',
																left:'50%',
																width:w+'px',
																height:h+'px',
																marginTop:'0'
															}, speed, function(){ 
																					this.className = 'slide-center';
																					this.setAttribute('style','');
																					$(this).find('span').fadeIn(); 
																					setpn(); 
																				});
		moving('left');
	};
}	
//setInterval(function(){ $('.arrow-right').trigger('click'); }, 9000);

function check_slides(side){
	if(slides.length <= 3) return true; //возвращаем тру для запрета пролистывания слайдов
	if(slides.length == 4) { //меняем класс для листания 4-х слайдов
	var pr = $('.slide-prev').get(0);
	var nxt = $('.slide-next').get(0);
		if(side == 'right'&& pr != undefined)
			pr.className = 'slide-next';
		if(side == 'left' && nxt != undefined)
			nxt.className = 'slide-prev';
	}
}

//Движение слайдов и работа с обесцвечиванием
function moving(side){
	left = $('.slide-left');
	center = $('.slide-center:first');
	right = $('.slide-right');
	prev = $('.slide-prev');
	next = $('.slide-next');
	
	center.find('span').hide();
	
	var el = (side=='right') ? prev : next;
	if(el.get(0)!=undefined)
		el.get(0).className = 'slide';
	
	if(side == 'right') {
		var ml = '0px'; var l = '0%'; var cl = 'left';
	}
	else {
		var ml = '-'+ww+'px'; var l = '100%'; var cl = 'right';
	}
	center.animate({width: ww+'px', 
					marginLeft: ml, 
					left: l, 
					height:hh+'px', 
					marginTop:'100px'
				}, speed, function(){ this.className = 'slide-'+cl+' '+cursor; this.setAttribute('style',''); });

	//изменяем размер обесцвеченных картинок и возвращаем им цвет
	var img = win[side].find('img');
	$(img).animate({width:w+'px', height:h+'px'}, speed, function(){
		if ($.browser.msie)
      		// фиксим эксплорер
       		$(img).css({'filter': 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)'});
	});
	
	win[side].find('.gsCanvas').animate({width:w+'px', height:h+'px', opacity:'0'}, speed);
	
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
}
	
});
