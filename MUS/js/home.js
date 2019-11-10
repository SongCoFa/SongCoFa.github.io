$("#home_choice1").hover(
    function () {
        $("#home_cover1").removeClass("op_08").addClass("op_0");
        $("#home_text1").removeClass("c_w").addClass("c_b");
        $("#home_text2").addClass("op_0");
    },
    function () {
        $("#home_cover1").removeClass("op_0").addClass("op_08");
        $("#home_text1").removeClass("c_b").addClass("c_w");
        $("#home_text2").removeClass("op_0");
    });

$("#home_choice2").hover(
    function () {
        $("#home_cover2").removeClass("op_08").addClass("op_0");
        $("#home_text2").removeClass("c_w").addClass("c_b");
        $("#home_text1").addClass("op_0");
    },
    function () {
        $("#home_cover2").removeClass("op_0").addClass("op_08");
        $("#home_text2").removeClass("c_b").addClass("c_w");
        $("#home_text1").removeClass("op_0");
    });

    