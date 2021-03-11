<template>
  <div>
    <section class="homevideo text-center">
      <youtube :video-id="homevideo" ref="youtube" @playing="playVideo()"></youtube>
      <!-- <button @click="playVideo">play</button> -->
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homevideo: "or5A_ZzB6YI"
    };
  },
  methods: {
    playVideo() {
      this.player.playVideo();
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    }
  }
};
</script>

<style lang="scss">
iframe {
  @media (min-width: 1201px) {
    width: 65vw;
    height: 80vh;
  }
  @media (max-width: 1200px) {
    width: 65vw;
    height: 50vh;
  }
  @media (max-width: 992px) {
    width: 70vw;
    height: 60vh;
  }
  @media (max-width: 768px) {
    width: 80vw;
    height: 60vh;
  }
}
.homevideo {
  width: 100vw;
  padding: 70px 0;
  background-color: rgb(18, 17, 27);
}
</style>