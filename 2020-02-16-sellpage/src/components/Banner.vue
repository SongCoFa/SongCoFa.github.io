<template>
  <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
      <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
      <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner" style="height: 70vh;">
      <div class="banner-img carousel-item active" style="z-index:0">
        <img src="../assets/images/Banner/banner.png" class="d-block w-100 bg-cover" alt />
      </div>
      <div class="banner-img carousel-item" style="z-index:0">
        <img src="../assets/images/Banner/banner2.png" class="d-block w-100 bg-cover" alt />
      </div>
      <div class="banner-img carousel-item" style="z-index:0">
        <img src="../assets/images/Banner/banner3.png" class="d-block w-100 bg-cover" alt />
      </div>
    </div>
    <a
      class="carousel-control-prev"
      href="#carouselExampleCaptions"
      role="button"
      data-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a
      class="carousel-control-next"
      href="#carouselExampleCaptions"
      role="button"
      data-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
    <h3 class="text-center" style="z-index:99">
      <b>
        <div>與神話中的英雄一起…</div>
        <div class="typing">刻下屬於你的冒險史詩!</div>
      </b>
    </h3>
  </div>
</template>

<style lang="scss" scoped>
#carouselExampleCaptions {
  box-sizing: border-box;
  width: 100vw;
  overflow: hidden;
  @media (min-width: 1201px) {
    height: 65vh;
    margin-bottom:1vh;
    .banner-img {
      top: -12vh;
    }
    h3 {
      width: 320px;
      left: calc(50% - 160px);
      font-size: 25px;
    }
  }
  @media (max-width: 1200px) {
    height: 60vh;
    .banner-img {
      top: 0vh;
    }
    h3 {
      width: 320px;
      left: calc(50% - 160px);
      font-size: 25px;
    }
  }
  @media (max-width: 1023px) {
    height: 60vh;
    margin-bottom: 10vh;
    .banner-img {
      top: -20vh;
    }
    h3 {
      width: 320px;
      left: calc(50% - 160px);
      font-size: 25px;
    }
  }
  @media (max-width: 768px) {
    height: 28vh;
    margin-bottom: 3vh;
    .banner-img {
      top: 0vh;
    }
    h3 {
      top: 25%;
      width: 200px;
      left: calc(50% - 100px);
      font-size: 17px;
      .typing {
        width: 11em; 
        animation: typing 3.5s steps(10, end),
          blink-caret 0.75s step-end infinite;
      }
      @keyframes typing {
        from {
          width: 0;
        }
        to {
          width: 9.5em;
        }
      }
      @keyframes blink-caret {
        from,
        to {
          box-shadow: 2px 0 0 0 transparent;
        }
        50% {
          box-shadow: 2px 0 0 0;
        }
      }
    }
  }
}
h3 {
  position: absolute;
  top: 45%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.55); // 0.45
  padding: 8px;
  line-height: 35px;
  border-radius: 10px;
  min-height: 90px;
  max-height: 100%;
  .typing {
    width: 11.5em;
    white-space: nowrap;
    border-right: 3px solid transparent; // 文字跟游標隔開 2px
    animation: typing 3.5s steps(10, end), blink-caret 0.75s step-end infinite;
    overflow: hidden;
    letter-spacing: 0;
  }
  // 打字動畫
  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 10.5em;
    }
  }
  // 閃爍游標
  @keyframes blink-caret {
    from,
    to {
      box-shadow: 2px 0 0 0 transparent;
    }
    50% {
      box-shadow: 2px 0 0 0;
    }
  }
}
</style>