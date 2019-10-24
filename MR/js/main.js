var _Show = document.querySelector("#Show");
var _nav_body = document.querySelector(".nav_body");
var _nav_border = document.querySelector(".nav_border");
var _Logo_bar1 = document.querySelector("#Logo_bar1");
var s1;
var stop_control = 0;
window.onmousewheel = document.onmousewheel = scrollFunc;

function scrollFunc(e) {
    e = e || window.event;

    if (stop_control <= 0) {
        stop_control = 3
        if (e.wheelDelta) {
            s1 = e.wheelDelta;
        } else if (e.detail) {
            s1 = e.detail * -1;
        }
        getsc()
        screen_move(s1)
        setTimeout(function () {
            stop_control = 0
        }, 1000)
    }
};

function getsc() {
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
};

var screen_value = 0;

function screen_move() {
    if (s1 < 0) {
        screen_value = screen_value + 1;
    } else if (s1 > 0) {
        screen_value = screen_value - 1;
    } else if (s2 < 0) {
        s2 = 0
        screen_value = screen_value + 1;
    } else if (s2 > 0) {
        s2 = 0
        screen_value = screen_value - 1;
    }
    screen_control(screen_value);
};

function screen_control() {
    _Logo_bar1.classList.add("grow")
    if (screen_value <= 0) {
        _Logo_bar1.classList.toggle("grow")
        _Show.style = "top:0;"
        _nav_body.style = "top:0;"
        _nav_border.classList.remove("nbg")
        screen_value = 0;
    } else if (screen_value >= 4) {
        _Show.style = "top:-400vh;"
        _nav_body.style = "top:-360px;"
        _nav_border.classList.add("nbg")
        screen_value = 4;
    } else if (screen_value >= 3) {
        _Show.style = "top:-300vh;"
        _nav_body.style = "top:-270px;"
        _nav_border.classList.add("nbg")
    } else if (screen_value >= 2) {
        _Show.style = "top:-200vh;"
        _nav_body.style = "top:-180px;"
        _nav_border.classList.add("nbg")
    } else if (screen_value >= 1) {
        _Show.style = "top:-100vh;"
        _nav_body.style = "top:-90px;"
        _nav_border.classList.add("nbg")
    }
};

var startY = 0;
var s2;
_Show.addEventListener("touchstart", function (e) {
    e = e || window.event;
    startY = e.changedTouches[0].screenY;
});
_Show.addEventListener("touchmove", function (e) {
    e = e || window.event;
    s2 = e.changedTouches[0].screenY - startY;
});
_Show.addEventListener("touchend", function (e) {
    e = e || window.event;
    screen_move(s2)
});


var _btn_home = document.querySelector("#btn_home");
var _btn_about = document.querySelector("#btn_about");
var _btn_works = document.querySelector("#btn_works");
var _btn_weather = document.querySelector("#btn_weather");
var _btn_contact = document.querySelector("#btn_contact");
_btn_home.onclick = function to_home() {
    screen_value = 0;
    screen_control(screen_value);
};
_btn_about.onclick = function to_about() {
    screen_value = 1;
    screen_control(screen_value);
};
_btn_works.onclick = function to_works() {
    screen_value = 2;
    screen_control(screen_value);
};
_btn_weather.onclick = function to_weather() {
    screen_value = 3;
    screen_control(screen_value);
};
_btn_contact.onclick = function to_contact() {
    screen_value = 4;
    screen_control(screen_value);
};


var _nav_page = document.querySelector("#Nav_page")
var _burger = document.querySelector("#Burger");
var _page_cover = document.querySelector(".page_cover");
var _cross = document.querySelector("#Cross");
var _cross1 = document.querySelector(".cross1");
var _cross2 = document.querySelector(".cross2");
var _burger1 = document.querySelector("#bgb1");
var _burger2 = document.querySelector("#bgb2");
var _burger3 = document.querySelector("#bgb3");
_burger.onclick = function () {
    burger_anime()
    setTimeout(function () {
        _nav_page.classList.toggle("none")
    }, 400)
    setTimeout(function () {
        _page_cover.classList.toggle("pcm")
    }, 500)
    setTimeout(cross_anime(), 2000)
};
_cross.onclick = function () {
    _page_cover.classList.toggle("pcm")
    cross_anime()
    setTimeout(function () {
        _nav_page.classList.toggle("none")
    }, 1200)
    setTimeout(function () {
        burger_anime()
    }, 1200)
};

function cross_anime() {
    setTimeout(function () {
        _cross1.classList.toggle("short")
    }, 500)
    setTimeout(function () {
        _cross2.classList.toggle("short")
    }, 800)
};

function burger_anime() {
    _burger1.classList.toggle("short1")
    _burger3.classList.toggle("short1")
    _burger2.classList.toggle("short2")
};

var _Pc_btn_home = document.querySelector("#Pc_btn_home");
var _Pc_about = document.querySelector("#Pc_about");
var _Pc_works = document.querySelector("#Pc_works");
var _Pc_weather = document.querySelector("#Pc_weather");
var _Pc_contact = document.querySelector("#Pc_contact");

function cross_click() {
    setTimeout(function () {
        _cross.onclick()
    }, 500)
};
_Pc_btn_home.onclick = function to_home() {
    screen_value = 0;
    screen_control(screen_value);
    cross_click();
};
_Pc_about.onclick = function to_about() {
    screen_value = 1;
    screen_control(screen_value);
    cross_click();
};
_Pc_works.onclick = function to_works() {
    screen_value = 2;
    screen_control(screen_value);
    cross_click();
};
_Pc_weather.onclick = function to_weather() {
    screen_value = 3;
    screen_control(screen_value);
    cross_click();
};
_Pc_contact.onclick = function to_contact() {
    screen_value = 4;
    screen_control(screen_value);
    cross_click();
};




var _location_area_select = document.querySelector("#location_area_select");
var _location_time_select = document.querySelector("#location_time_select");
var _location;

fetch('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-091?Authorization=CWB-57D9EA17-10B6-4B47-9812-3E3C7332CE44&format=JSON')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {

        _location = myJson.cwbopendata.dataset.locations.location;

        var T = _location[0].weatherElement[0].time[1].elementValue.value;
        var PoP12h = _location[0].weatherElement[9].time[1].elementValue.value;
        var Wx = _location[0].weatherElement[12].time[1].elementValue[0].value;
        var UVI_value = _location[0].weatherElement[13].time[1].elementValue[0].value;
        var UVI_LV = _location[0].weatherElement[13].time[1].elementValue[1].value;


        _txt1.innerHTML = `
                <h6>${_location[0].locationName}</h6><h5>${T}度</h5><h4>平均氣溫</h4>
            `;
        _txt2.innerHTML = `
                <h6>${_location[0].locationName}</h6><h5>${PoP12h}%</h5><h4>降雨機率</h4>
            `;
        _txt3.innerHTML = `
                <h6>${_location[0].locationName}</h6><h5>${Wx}</h5><h4>天氣現象</h4>
            `;
        _txt4.innerHTML = `
                <h6>${_location[0].locationName}</h6><h5>${UVI_value}<span>  </span>${UVI_LV}</h5><h4>紫外線指數</h4>
            `;

        for (let index = 0; index < _location[0].weatherElement[13].time.length; index++) {
            const element_2 = _location[0].weatherElement[13].time[index];

            _location_time_select.innerHTML += `
                    <option value="${element_2.startTime}">${element_2.startTime}</option>
                    `;
        };

        for (let index = 0; index < _location.length; index++) {
            const element = _location[index];

            _location_area_select.innerHTML += `
                    <option value="${element.locationName}">${element.locationName}</option>
                    `;
        };

        var location_name;
        var name_value = 0;
        _location_area_select.onchange = function () {
            for (let index = 0; index < _location.length; index++) {
                const element = _location[index];

                if (_location_area_select.value === element.locationName) {
                    name_value = index;
                    
                    location_name = _location[name_value].locationName;
                    T = _location[name_value].weatherElement[0].time[time_value_1].elementValue.value;
                    PoP12h = _location[name_value].weatherElement[9].time[time_value_1].elementValue.value;
                    Wx = _location[name_value].weatherElement[12].time[time_value_1].elementValue[0].value;
                    UVI_value = _location[name_value].weatherElement[13].time[time_value_2].elementValue[0].value;
                    UVI_LV = _location[name_value].weatherElement[13].time[time_value_2].elementValue[1].value;

                    _txt1.innerHTML = `
                        <h6>${location_name}</h6><h5>${T}度</h5><h4>平均氣溫</h4>
                    `;
                    _txt2.innerHTML = `
                        <h6>${location_name}</h6><h5>${PoP12h}%</h5><h4>降雨機率</h4>
                    `;
                    _txt3.innerHTML = `
                        <h6>${location_name}</h6><h5>${Wx}</h5><h4>天氣現象</h4>
                    `;
                    _txt4.innerHTML = `
                        <h6>${location_name}</h6><h5>${UVI_value}<span>  </span>${UVI_LV}</h5><h4>紫外線指數</h4>
                    `;
                };
            };

        };

        var time_value_1 = 2;
        var time_value_2 = 1;
        _location_time_select.onchange = function () {
            for (let index = 0; index < _location[0].weatherElement[13].time.length; index++) {
                const element_2 = _location[0].weatherElement[13].time[index];

                if (_location_time_select.value === element_2.startTime) {
                    time_value_1 = index* 2;
                    time_value_2 = index;

                    location_name = _location[name_value].locationName;
                    T = _location[name_value].weatherElement[0].time[time_value_1].elementValue.value;
                    PoP12h = _location[name_value].weatherElement[9].time[time_value_1].elementValue.value;
                    Wx = _location[name_value].weatherElement[12].time[time_value_1].elementValue[0].value;
                    UVI_value = _location[name_value].weatherElement[13].time[time_value_2].elementValue[0].value;
                    UVI_LV = _location[name_value].weatherElement[13].time[time_value_2].elementValue[1].value;

                    _txt1.innerHTML = `
                        <h6>${location_name}</h6><h5>${T}度</h5><h4>平均氣溫</h4>
                    `;
                    _txt2.innerHTML = `
                        <h6>${location_name}</h6><h5>${PoP12h}%</h5><h4>降雨機率</h4>
                    `;
                    _txt3.innerHTML = `
                        <h6>${location_name}</h6><h5>${Wx}</h5><h4>天氣現象</h4>
                    `;
                    _txt4.innerHTML = `
                        <h6>${location_name}</h6><h5>${UVI_value}<span>  </span>${UVI_LV}</h5><h4>紫外線指數</h4>
                    `;
                };
            };

        };

    });

var _txt1 = document.querySelector(".text1");
var _txt2 = document.querySelector(".text2");
var _txt3 = document.querySelector(".text3");
var _txt4 = document.querySelector(".text4");
var _court = document.querySelector(".court");
var _sp1 = 0;

function showtext() {
    _sp1++;
    if (_sp1 <= 1) {
        dis_txt()
        _txt1.classList.toggle("disapper")
    } else if (_sp1 <= 2) {
        dis_txt()
        _txt2.classList.toggle("disapper")
    } else if (_sp1 <= 3) {
        dis_txt()
        _txt3.classList.toggle("disapper")
    } else if (_sp1 >= 4) {
        dis_txt()
        _txt4.classList.toggle("disapper")
        _sp1 = 0;
    };
};

function dis_txt() {
    _txt1.classList.add("disapper");
    _txt2.classList.add("disapper");
    _txt3.classList.add("disapper");
    _txt4.classList.add("disapper");
};
setInterval(showtext, 10000);
_court.onclick = function () {
    showtext(_sp1);
};



var _big_pic1 = document.querySelector("#big_pic1");
var _big_pic2 = document.querySelector("#big_pic2");
var _wk_btn1 = document.querySelector(".wk_btn1");
var _wk_btn2 = document.querySelector(".wk_btn2");
var _showbox1 = document.querySelector("#showbox1");
var _showbox2 = document.querySelector("#showbox2");
var wk_value = 0;
_wk_btn1.onclick = changematte;
_wk_btn2.onclick = changematte;

function changematte() {
    if (wk_value = 0) {
        wk_value++;
        _big_pic1.classList.toggle("slide_out")
        _big_pic1.classList.toggle("none")
        _big_pic1.classList.toggle("slide_in")
        _big_pic2.classList.toggle("slide_out")
        _big_pic2.classList.toggle("none")
        _big_pic2.classList.toggle("slide_in")
        _showbox1.classList.toggle("none")
        _showbox2.classList.toggle("none");
    } else if (wk_value = 1) {
        _big_pic2.classList.toggle("slide_out")
        _big_pic2.classList.toggle("none")
        _big_pic2.classList.toggle("slide_in")
        _big_pic1.classList.toggle("slide_out")
        _big_pic1.classList.toggle("none")
        _big_pic1.classList.toggle("slide_in")
        _showbox2.classList.toggle("none")
        _showbox1.classList.toggle("none")
        return wk_value = 0;
    }
};

var _wk_show_box = document.querySelector(".wk_show_box");
var _wk_btn3 = document.querySelector(".wk_btn3");
_wk_btn3.onclick = function () {
    _wk_show_box.classList.toggle("none")
    setTimeout(function () {
        _wk_show_box.classList.toggle("transparency")
    }, 500)
};

var _b1t = document.querySelector(".b1t");
var _b2t = document.querySelector(".b2t");
var _b3t = document.querySelector(".b3t");
var _ab_size = document.querySelector(".ab_size");
var _ab_box = document.querySelector(".ab_box");
var _ab_icon = document.querySelector(".about_icon");
var _st_btn1 = document.querySelector(".st_btn1");
var _st_btn2 = document.querySelector(".st_btn2");
_b1t.onclick = function () {
    st_value = 1
    st_control()
    st_box_show()
};
_b2t.onclick = function () {
    st_value = 3
    st_control()
    st_box_show()
};
_b3t.onclick = function () {
    st_value = 2
    st_control()
    st_box_show()
};
_ab_icon.onclick = st_box_show;

function st_clear() {
    _ab_size.classList.remove("letter")
    _ab_size.classList.remove("skill")
    _ab_size.classList.remove("name")
};

function st_box_show() {
    _ab_box.classList.toggle("none")
    _ab_box.classList.toggle("ab_box_show")
};
var st_value = 1;
_st_btn1.onclick = function () {
    st_value--
    st_control()
};
_st_btn2.onclick = function () {
    st_value++
    st_control()
};

function st_control() {
    if (st_value <= -1) {
        st_value = st_value + 3
        st_clear()
        _ab_size.classList.add("skill")
    } else if (st_value <= 0) {
        st_value = st_value + 3
        st_clear()
        _ab_size.classList.add("letter")
    } else if (st_value <= 1) {
        st_clear()
        _ab_size.classList.add("name")
    } else if (st_value >= 4) {
        st_value = st_value - 3
        st_clear()
        _ab_size.classList.add("name")
    } else if (st_value >= 3) {
        st_value = st_value - 3
        st_clear()
        _ab_size.classList.add("letter")
    } else {
        st_clear()
        _ab_size.classList.add("skill")
    }
};

var _switch = document.querySelector(".switch");
var _sw_control = document.querySelector(".sw_control");
var _night = document.querySelector(".night");
var _sun_box = document.querySelector(".sun_box");
var _moon_box = document.querySelector(".moon_box");
var _text5 = document.querySelector(".text5");
_switch.onclick = function () {
    _switch.classList.toggle("sw_color")
    _sw_control.classList.toggle("sw_on")
    _sun_box.classList.toggle("control_bar")
    _moon_box.classList.toggle("control_bar")
    _night.classList.toggle("transparency")
    _text5.classList.toggle("text_color")
};