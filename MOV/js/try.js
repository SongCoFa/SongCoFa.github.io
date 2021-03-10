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