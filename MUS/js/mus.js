var player11;
var player12;
var player13;
var player14;
var player15;
var player16;
var player21;
var player22;
var player23;
var player24;
var player25;
var player26;


var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player11 = new YT.Player("mus1_video1", {
        videoId: "SX_ViT4Ra7k",
        height:"250px",
        width:"350px",
    });
    player12 = new YT.Player("mus1_video2", {
        videoId: "Dx_fKPBPYUI", 
        height:"250px",
        width:"350px",
    });
    player13 = new YT.Player("mus1_video3", {
        videoId: "-tKVN2mAKRI", 
        height:"250px",
        width:"350px",
    });
    player14 = new YT.Player("mus1_video4", {
        videoId: "lzAyrgSqeeE", 
        height:"250px",
        width:"350px",
    });
    player15 = new YT.Player("mus1_video5", {
        videoId: "1oMxrHXzOsY",
        height:"250px",
        width:"350px",
    });
    player16 = new YT.Player("mus1_video6", {
        videoId: "Uh6dkL1M9DM",
        height:"250px",
        width:"350px",
    });
    player21 = new YT.Player("mus2_video1", {
        videoId: "mvkbCZfwWzA", 
        height:"250px",
        width:"350px",
    });
    player22 = new YT.Player("mus2_video2", {
        videoId: "DP89-sZL1YM", 
        height:"250px",
        width:"350px",
    });
    player23 = new YT.Player("mus2_video3", {
        videoId: "vgFCRaymmI4", 
        height:"250px",
        width:"350px",
    });
    player24 = new YT.Player("mus2_video4", {
        videoId: "6VzUEZ6adhg", 
        height:"250px",
        width:"350px",
    });
    player25 = new YT.Player("mus2_video5", {
        videoId: "wVMPqFb5Iy8",
        height:"250px",
        width:"350px",
    });
    player26 = new YT.Player("mus2_video6", {
        videoId: "-mb-3AkZWzE",
        height:"250px",
        width:"350px",
    });
}

$("#mus1_video1_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus1_video1_box").toggleClass("fav");
});

$("#mus1_video2_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus1_video2_box").toggleClass("fav");
});

$("#mus1_video3_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus1_video3_box").toggleClass("fav");
});

$("#mus1_video4_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus1_video4_box").toggleClass("fav");
});

$("#mus1_video5_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus1_video5_box").toggleClass("fav");
});

$("#mus1_video6_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus1_video6_box").toggleClass("fav");
});

$("#mus2_video1_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus2_video1_box").toggleClass("fav");
});

$("#mus2_video2_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus2_video2_box").toggleClass("fav");
});

$("#mus2_video3_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus2_video3_box").toggleClass("fav");
});

$("#mus2_video4_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus2_video4_box").toggleClass("fav");
});

$("#mus2_video5_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus2_video5_box").toggleClass("fav");
});

$("#mus2_video6_fav").click(function(){
    $(this).toggleClass("bgc_pink");
    $("#mus2_video6_box").toggleClass("fav");
});