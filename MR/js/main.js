var _Show = document.querySelector("#Show");
var _nav_body = document.querySelector(".nav_body");
var _nav_border = document.querySelector(".nav_border");
var s1;
window.onmousewheel = document.onmousewheel = scrollFunc;
function scrollFunc(e) {
    e = e || window.event;
    var t1 = document.getElementById("wheelDelta");
    var t2 = document.getElementById("detail");
    if (e.wheelDelta) {
        s1 = e.wheelDelta;
    } else if (e.detail) {
        s1 = e.detail * -1;
    }        
    getsc()
    screen_move(s1)
    };
    
function getsc(){if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}};
var screen_value = 0;
function screen_move(){
    if(s1 < 0){
        screen_value = screen_value + 1;            
    }else if(s1 > 0){
        screen_value = screen_value - 1;
    }
    screen_control(screen_value);        
};
function screen_control(){
    if(screen_value <= 0){
        _Show.style = "top:0;"
        _nav_body.style = "top:0;"
        _nav_border.style = "width:30vw;"
        screen_value = screen_value * 0;
    }else if(screen_value >= 8){
        _Show.style = "top:-400vh;"
        _nav_body.style = "top:-360px;"
        _nav_border.style = "width:10vw;"
        screen_value = screen_value * 0 + 8;
    }else if(screen_value >= 6){
        _Show.style = "top:-300vh;"
        _nav_body.style = "top:-270px;"
        _nav_border.style = "width:10vw;"
    }else if(screen_value >= 4){
        _Show.style = "top:-200vh;"
        _nav_body.style = "top:-180px;"
        _nav_border.style = "width:10vw;"
    }
    else if(screen_value >= 2){
        _Show.style = "top:-100vh;"
        _nav_body.style = "top:-90px;"
        _nav_border.style = "width:10vw;"
    }
};

var _btn_home = document.querySelector("#btn_home");
var _btn_spirit = document.querySelector("#btn_spirit");
var _btn_works = document.querySelector("#btn_works");
var _btn_story = document.querySelector("#btn_story");
var _btn_contact = document.querySelector("#btn_contact");
_btn_home.onclick = function to_home(){
    screen_value = screen_value * 0;
    screen_control(screen_value);
    console.log(screen_value)
};
_btn_spirit.onclick = function to_spirit(){
    screen_value = screen_value * 0 + 2;
    screen_control(screen_value);
    console.log(screen_value)
};
_btn_works.onclick = function to_works(){
    screen_value = screen_value * 0 + 4;
    screen_control(screen_value);
    console.log(screen_value)
};
_btn_story.onclick = function to_story(){
    screen_value = screen_value * 0 + 6;
    screen_control(screen_value);
    console.log(screen_value)
};
_btn_contact.onclick = function to_contact(){
    screen_value = screen_value * 0 + 8;
    screen_control(screen_value);
    console.log(screen_value)
};


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

var _Pc_btn_home = document.querySelector("#Pc_btn_home");
var _Pc_spirit = document.querySelector("#Pc_spirit");
var _Pc_works = document.querySelector("#Pc_works");
var _Pc_story = document.querySelector("#Pc_story");
var _Pc_contact = document.querySelector("#Pc_contact");
function cross_click(){
    setTimeout(function(){_cross.onclick()},500)
};
_Pc_btn_home.onclick = function to_home(){
    screen_value = screen_value * 0;
    screen_control(screen_value);
    cross_click();
};
_Pc_spirit.onclick = function to_spirit(){
    screen_value = screen_value * 0 + 2;
    screen_control(screen_value);
    cross_click();
};
_Pc_works.onclick = function to_works(){
    screen_value = screen_value * 0 + 4;
    screen_control(screen_value);
    cross_click();
};
_Pc_story.onclick = function to_story(){
    screen_value = screen_value * 0 + 6;
    screen_control(screen_value);
    cross_click();
};
_Pc_contact.onclick = function to_contact(){
    screen_value = screen_value * 0 + 8;
    screen_control(screen_value);
    cross_click();
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

var _big_pic1 = document.querySelector("#big_pic1");
var _big_pic2 = document.querySelector("#big_pic2");
var _wk_btn1 = document.querySelector(".wk_btn1");
var _wk_btn2 = document.querySelector(".wk_btn2");
var _showbox1 = document.querySelector("#showbox1");
var _showbox2 = document.querySelector("#showbox2");
var wk_value = 0;
_wk_btn1.onclick = changematte;
_wk_btn2.onclick = changematte;  
function changematte(){
    if(wk_value = 0){
        wk_value++;
        _big_pic1.classList.toggle("slide_out")
        setTimeout(_big_pic1.classList.toggle("none"),500)
        setTimeout(_big_pic1.classList.toggle("slide_in"),1000)
        setTimeout(_big_pic2.classList.toggle("slide_out"),1500)
        setTimeout(_big_pic2.classList.toggle("none"),2000)
        setTimeout(_big_pic2.classList.toggle("slide_in"),2500)
        setTimeout(_showbox1.classList.toggle("none"),3000)
        setTimeout(_showbox2.classList.toggle("none"),3500);
    }else if(wk_value = 1){
        _big_pic2.classList.toggle("slide_out")
        setTimeout(_big_pic2.classList.toggle("none"),500)
        setTimeout(_big_pic2.classList.toggle("slide_in"),1000)
        setTimeout(_big_pic1.classList.toggle("slide_out"),1500)
        setTimeout(_big_pic1.classList.toggle("none"),2000)
        setTimeout(_big_pic1.classList.toggle("slide_in"),2500)
        setTimeout(_showbox2.classList.toggle("none"),3000)
        setTimeout(_showbox1.classList.toggle("none"),3500)
        return wk_value = 0;
    }
};

var _wk_show_box = document.querySelector(".wk_show_box");
var _wk_btn3 = document.querySelector(".wk_btn3");
_wk_btn3.onclick = function(){
    _wk_show_box.classList.toggle("none")
    setTimeout(function(){_wk_show_box.classList.toggle("transparency")},500)
};

var _b1t = document.querySelector(".b1t");
var _b2t = document.querySelector(".b2t");
var _b3t = document.querySelector(".b3t");
var _ab_size = document.querySelector(".ab_size");
var _ab_box = document.querySelector(".ab_box");
var _ab_icon = document.querySelector(".about_icon");
var _st_btn1 = document.querySelector(".st_btn1");
var _st_btn2 = document.querySelector(".st_btn2");
_b1t.onclick = function(){
    st_value = 1
    st_control()
    st_box_show()
};
_b2t.onclick = function(){
    st_value = 3
    st_control()
    st_box_show()
};
_b3t.onclick = function(){
    st_value = 2
    st_control()
    st_box_show()
};
_ab_icon.onclick = st_box_show;
function st_clear(){
    _ab_size.classList.remove("letter")
    _ab_size.classList.remove("skill")
    _ab_size.classList.remove("name")
};
function st_box_show() {
    _ab_box.classList.toggle("none")
    _ab_box.classList.toggle("ab_box_show")
};
var st_value = 1;
_st_btn1.onclick = function(){
    st_value--
    st_control()
};
_st_btn2.onclick = function(){
    st_value++
    st_control()
};
function st_control(){
    if(st_value <= -1){
        st_value = st_value + 3
        st_clear()
        _ab_size.classList.add("skill")
    }
    else if(st_value <= 0){
        st_value = st_value + 3
        st_clear()
        _ab_size.classList.add("letter")
    }
    else if(st_value <= 1){
        st_clear()
        _ab_size.classList.add("name")
    }
    else if(st_value >= 4){
        st_value = st_value - 3
        st_clear()
        _ab_size.classList.add("name")
    }
    else if(st_value >= 3){
        st_value = st_value - 3
        st_clear()
        _ab_size.classList.add("letter")
    }
    else{
        st_clear()
        _ab_size.classList.add("skill")
    }
};

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

