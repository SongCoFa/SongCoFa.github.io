function hide(){
    $('#control_box').addClass('top_0');
    $('#header').addClass('tittle_height');
};

function show(){
    $('#header').removeClass('tittle_height');
    $('#control_box').removeClass('top_0');
};

$("#header").hover(function(){
    show()
});

var past_scroll = 0;
var now_scroll;
var scroll_value;
var scroll_control = 0;


$(window).scroll(function () {
    if(scroll_control <= 0){
        scroll_control = 1;
        now_scroll = scrollY;
        scroll_value = now_scroll - past_scroll;
        tittle_control(scroll_value);
    };
    past_scroll = scrollY;
});

function tittle_control(){
    if(scroll_value >= 0){        
        if(scrollY >= 90){
            if($('#header').hasClass('tittle_height')){
                scroll_control = 0;
                return;
            }else{
                hide();
                clearclass();
                scroll_control = 0;
                return;
            };
        }else{
            scroll_control = 0;
            return;
        };
    }else{
        if(scrollY <= 90){
            show();
            scroll_control = 0;
            return;
        }
        else{
            if($('#header').hasClass('tittle_height')){
                scroll_control = 0;
                return;
            }else{
                hide();
                clearclass();
                scroll_control = 0;
                return;
            };
        };
    };
};

function clearclass() {
    $('#Check_box_lan').removeClass('bot_0');
    $('#Check_box_bgc').removeClass('bot_0');
}

$('#language').click(function () {
    if ($('#Check_box_lan').hasClass('bot_0')) {
        clearclass();
    } else {
        clearclass(),
        $('#Check_box_lan').toggleClass('bot_0');
    };
});

$('#bgcolor').click(function () {
    if ($('#Check_box_bgc').hasClass('bot_0')) {
        clearclass();
    } else {
        clearclass(),
        $('#Check_box_bgc').toggleClass('bot_0');
    };
});

$('#favorite').click(function(){
    $('#favorite img').toggleClass('icon_pink');
    $('.video_box_in').not('.fav').toggleClass('not_fav');
});

var lan_value;
$('#Check_box_lan li input').click(function () {
    lan_value = $(this).val();
    if ($(this).prop('checked')) {
        $('#Check_box_lan li input:checkbox').prop('checked', false);
        $(this).prop('checked', true);
        
        if(lan_value == "CH"){
            $('#check_box_text')[0].innerHTML=`
            <h5>背景色</h5>
            `

            $('#home_btn')[0].innerHTML=`
            <h5>首頁</h5>
            `

            $('#home_text1')[0].innerHTML=`
            <h3>米津玄師</h3>
            <h5>音樂鬼才</h5>
            `

            $('#home_text2')[0].innerHTML=`
            <h2>Aimer</h2>
            <h5>靈魂歌姬</h5>
            `
            
            $('#mus1_text1')[0].innerHTML=`
            <h5>用音樂革命的</h5>
            `

            $('#mus1_text2')[0].innerHTML=`
            <h5>野獸</h5>
            `

            $('#mus2_text1')[0].innerHTML=`
            <h5>閃耀於午夜的</h5>
            `

            $('#mus2_text2')[0].innerHTML=`
            <h5>月光</h5>
            `

        }else{
            $('#check_box_text')[0].innerHTML=`
            <h4>color</h4>
            `

            $('#home_btn')[0].innerHTML=`
            <h4>Home</h4>
            `

            $('#home_text1')[0].innerHTML=`
            <h2>米津玄師</h2>
            <h4>Musical genius</h4>
            `

            $('#home_text2')[0].innerHTML=`
            <h2>Aimer</h2>
            <h4>Ethereal voice</h4>
            `

            $('#mus1_text1')[0].innerHTML=`
            <h4>Music and the</h4>
            `

            $('#mus1_text2')[0].innerHTML=`
            <h4>Beast</h4>
            `

            $('#mus2_text1')[0].innerHTML=`
            <h4>Music and the</h4>
            `

            $('#mus2_text2')[0].innerHTML=`
            <h4>Beast</h4>
            `

        }
    }
});

var bgc_value;
$('#Check_box_bgc li input').click(function () {
    bgc_value = $(this).val();
    if ($(this).prop('checked')) {
        $('#Check_box_bgc li input:checkbox').prop('checked', false);
        $(this).prop('checked', true);

        if(bgc_value == "blue"){
            clear_bgc();
            bgc_blue();
        }else if(bgc_value == "pink"){
            clear_bgc();
            bgc_pink();
        }else if(bgc_value == "gray"){
            clear_bgc();
            bgc_gray();
        };
    };
});

function clear_bgc(){
    $("#control_box").removeClass("bgc_bg bgc_rp bgc_whitegray");
    $("#tittle").removeClass("bgc_db bgc_dr bgc_black");
    $("#mus1_box_top").removeClass("bgc_dbg bgc_drp bgc_gray");
    $("#mus1_box_mid").removeClass("bgc_db bgc_dr bgc_black");
    $("#mus1_box_bot").removeClass("bgc_dbg bgc_drp bgc_gray");
    $("#mus2_box_top").removeClass("bgc_dbg bgc_drp bgc_gray");
    $("#mus2_box_mid").removeClass("bgc_db bgc_dr bgc_black");
    $("#mus2_box_bot").removeClass("bgc_dbg bgc_drp bgc_gray");
};

function bgc_blue(){
    $("#control_box").addClass("bgc_bg");
    $("#tittle").addClass("bgc_db");
    $("#mus1_box_top").addClass("bgc_dbg");
    $("#mus1_box_mid").addClass("bgc_db");
    $("#mus1_box_bot").addClass("bgc_dbg");
    $("#mus2_box_top").addClass("bgc_dbg");
    $("#mus2_box_mid").addClass("bgc_db");
    $("#mus2_box_bot").addClass("bgc_dbg");
};

function bgc_pink(){
    $("#control_box").addClass("bgc_rp");
    $("#tittle").addClass("bgc_dr");
    $("#mus1_box_top").addClass("bgc_drp");
    $("#mus1_box_mid").addClass("bgc_dr");
    $("#mus1_box_bot").addClass("bgc_drp");
    $("#mus2_box_top").addClass("bgc_drp");
    $("#mus2_box_mid").addClass("bgc_dr");
    $("#mus2_box_bot").addClass("bgc_drp");    
};

function bgc_gray(){
    $("#control_box").addClass("bgc_whitegray");
    $("#tittle").addClass("bgc_black");
    $("#mus1_box_top").addClass("bgc_gray");
    $("#mus1_box_mid").addClass("bgc_black");
    $("#mus1_box_bot").addClass("bgc_gray");
    $("#mus2_box_top").addClass("bgc_gray");
    $("#mus2_box_mid").addClass("bgc_black");
    $("#mus2_box_bot").addClass("bgc_gray");    
};