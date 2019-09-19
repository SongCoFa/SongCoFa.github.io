var _btn_home = document.querySelector("#btn_home");
var _btn_spirit = document.querySelector("#btn_spirit");
var _btn_works = document.querySelector("#btn_works");
var _btn_story = document.querySelector("#btn_story");
var _btn_contact = document.querySelector("#btn_contact");
// var _btn_home = document.querySelector(".hm");
// var _nav = document.querySelector("#Nav");
// var _box = document.querySelector(".box");
// var _swiper_wrapper = document.querySelector(".swiper-wrapper");
// var _tra_start = "translate3d(0px, 0px, 0px)";
// function navchange(){
//     let _tray = _swiper_wrapper.style.transform;    
//     if(_tray === _tra_start){
//         _btn_home.classList.remove("grow");
//         _nav.style = "display:flex;";
//         _box.classList.add("box1");
//         _box.classList.remove("box2");        
//     }
//     else if(_tray === ""){
//         _btn_home.classList.remove("grow");
//         _nav.style = "display:flex;";
//         _box.classList.add("box1");
//         _box.classList.remove("box2");        
//     }
//     else{
//         _btn_home.classList.add("grow");
//         _nav.style = "display:none;";
//         _box.classList.add("box2"); 
//         _box.classList.remove("box1");             
//     };
      
// };
// var t0 = 0;
// var t2;
// function fortwice(){
//     if(t0 == 2){
//         clearTimeout(t2);
//         return t0 = 0;
//     }
//     else{
//         navchange();
//         t0++;
//         if(t2){
//             clearTimeout(t2)
//         }
//         t2 = setTimeout(fortwice,200)
//     }
//     };
// btn_1.addEventListener("click", fortwice, false);
// btn_2.addEventListener("click", fortwice, false);
// btn_3.addEventListener("click", fortwice, false);
// btn_4.addEventListener("click", fortwice, false);
// btn_5.addEventListener("click", fortwice, false);
// var _mouse_control;
// if (window.addEventListener)
//     window.addEventListener('DOMMouseScroll', wheel, false);
// window.onmousewheel = document.onmousewheel = wheel;
// function wheel(event){
//     var delta = 0;
//     if (!event) event = window.event;
//     if (event.wheelDelta) {
//         delta = event.wheelDelta/120; 
//         if (window.opera) delta = -delta;
//     } else if (event.detail) {
//         delta = -event.detail/3;
//     }
//     if (delta)
//         handle(delta);
// }
// function handle(delta) {
//     var _mouse_control = 3;    
//     if (delta <0){
//         _mouse_control = _mouse_control + 1;
//         gosmooth(_mouse_control);    
//     }else{
//         _mouse_control = _mouse_control - 1;
//         gosmooth(_mouse_control);
//     }
// };
var _nav_page = document.querySelector("#Nav_page")
var _burger = document.querySelector("#Burger");
var _page_cover = document.querySelector(".page_cover");
var _cross = document.querySelector("#Cross");
_burger .onclick = function() {
    _nav_page.classList.toggle("none")
    setTimeout(function(){_page_cover.classList.toggle("pcm")},500)
};
_cross .onclick = function() {
    _page_cover.classList.toggle("pcm")
    setTimeout(function(){_nav_page.classList.toggle("none")},1000)    
};
var _txts = document.querySelector(".t_size");
var _txt1 = document.querySelector(".text1");
var _txt2 = document.querySelector(".text2");
var _txt3 = document.querySelector(".text3");
var _txt4 = document.querySelector(".text4");
var _sp1 = 0;
var _sp2 = 10;
function showtext(){
    _sp1++;
    if(_sp1 == 5){
        _txt1.classList.toggle("disapper")
        _txt2.classList.toggle("disapper")
    }else if(_sp1 == 10){
        _txt2.classList.toggle("disapper")
        _txt3.classList.toggle("disapper")
    }else if(_sp1 == 15){
        _txt3.classList.toggle("disapper")
        _txt4.classList.toggle("disapper")
    }else if(_sp1 == 20){
        _txt4.classList.toggle("disapper")
        _txt1.classList.toggle("disapper")
        return _sp1 = 0
    } 
};
setInterval(showtext,1000);
var _switch = document.querySelector(".switch");
var _sw_control = document.querySelector(".sw_control");
var _night = document.querySelector(".night");
var _sun_box = document.querySelector(".sun_box");
var _moon_box = document.querySelector(".moon_box");
_switch.onclick = function(){
    _switch.classList.toggle("sw_color")
    _sw_control.classList.toggle("sw_on")
    _sun_box.classList.toggle("control_bar")
    _moon_box.classList.toggle("control_bar")
    _night.classList.toggle("transparency")
};