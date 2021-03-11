var mySwiper = new Swiper('.swiper-container', {
  loop: true,

  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

});

// burger_bar點擊事件
$("#burger_btn1").click(function(){
  $("#burger1_bar1").addClass("burger_ball_w0");
  $("#burger1_bar2").addClass("burger_ball_w0");
  $("#burger1_bar3").addClass("burger_ball_w0");
  setTimeout(function(){$("#burger_btn2").removeClass("burger_btn_box0")},1000);
  setTimeout(function(){$("#burger_box2").addClass("burger_box_wid2")},1300);
  setTimeout(function(){$("#burger_box31").hide()},1100);
});

$("#burger_btn2").click(function(){
  $("#burger_box2").removeClass("burger_box_wid2");
  $("#burger_btn2").addClass("burger_btn_box0");
  setTimeout(function(){$("#burger_box31").show()},1000);
  setTimeout(b_ball_show,1100);    
});

function b_ball_show(){
  $("#burger1_bar3").removeClass("burger_ball_w0");
  $("#burger1_bar2").removeClass("burger_ball_w0");
  $("#burger1_bar1").removeClass("burger_ball_w0");
};

// sp_pic的圖片效果
$("#sp_pic1").hover(function(){
  $("#t1_top").toggleClass("bd_blue");
  $("#t1_right").toggleClass("bd_blue");
  $("#t1_bot").toggleClass("bd_blue");
  $("#t1_left").toggleClass("bd_blue");
});

$("#sp_pic1").mouseenter(function(){
  $("#t1_top").addClass("bd_show");
  setTimeout(function(){
    $("#t1_right").addClass("bd_show");
  },500);
  setTimeout(function(){
    $("#t1_bot").addClass("bd_show");
  },1000);
  setTimeout(function(){
    $("#t1_left").addClass("bd_show");
  },1500);
});

$("#sp_pic2").hover(function(){
  $("#t2_top").toggleClass("bd_blue");
  $("#t2_right").toggleClass("bd_blue");
  $("#t2_bot").toggleClass("bd_blue");
  $("#t2_left").toggleClass("bd_blue");
});

$("#sp_pic2").mouseenter(function(){
  $("#t2_top").addClass("bd_show");
  setTimeout(function(){
    $("#t2_right").addClass("bd_show");
  },500);
  setTimeout(function(){
    $("#t2_bot").addClass("bd_show");
  },1000);
  setTimeout(function(){
    $("#t2_left").addClass("bd_show");
  },1500);
});

$("#sp_pic3").hover(function(){
  $("#t3_top").toggleClass("bd_blue");
  $("#t3_right").toggleClass("bd_blue");
  $("#t3_bot").toggleClass("bd_blue");
  $("#t3_left").toggleClass("bd_blue");
});

$("#sp_pic3").mouseenter(function(){
  $("#t3_top").addClass("bd_show");
  setTimeout(function(){
    $("#t3_right").addClass("bd_show");
  },500);
  setTimeout(function(){
    $("#t3_bot").addClass("bd_show");
  },1000);
  setTimeout(function(){
    $("#t3_left").addClass("bd_show");
  },1500);
});

$("#sp_pic4").hover(function(){
  $("#t4_top").toggleClass("bd_blue");
  $("#t4_right").toggleClass("bd_blue");
  $("#t4_bot").toggleClass("bd_blue");
  $("#t4_left").toggleClass("bd_blue");
});

$("#sp_pic4").mouseenter(function(){
  $("#t4_top").addClass("bd_show");
  setTimeout(function(){
    $("#t4_right").addClass("bd_show");
  },500);
  setTimeout(function(){
    $("#t4_bot").addClass("bd_show");
  },1000);
  setTimeout(function(){
    $("#t4_left").addClass("bd_show");
  },1500);
});
