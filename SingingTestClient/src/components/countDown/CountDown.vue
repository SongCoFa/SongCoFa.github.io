<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button" @click="SettingTime()"><font-awesome-icon :icon="['fas', 'stopwatch']" size="lg" /></button>
      </div>
      <button class="btn btn-success custom-right-button" type="button" @click="ExcuteUpdate()" v-show="SettingMode === false">{{CurrentTime | MillisecondToSecond}}</button>
      <input
        type="number"
        class="form-control time-setting-input"
        v-model="settingNumber"
        v-if="SettingMode"
        @blur="CompleteSetting()"
        @keyup.enter="$event.target.blur()"
        />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    SetDelayTimeSec: {
      type: Number,
      default: 30,
    },
    CountDownType: String,
  },
  data() {
    return {
      delaySetting: null,
      timerId: null,
      CurrentTime: 0,
      SettingMode: false,
      settingNumber: 20,
    };
  },
  filters: {
    MillisecondToSecond(value) {
      return value / 1000;
    },
  },
  mounted() {
    this.RetriveTableContentFrequently();
    this.InitRefreshTime();
    this.settingNumber = this.delaySetting / 1000;
  },
  methods: {
    InitRefreshTime() {
      const LocalstorageTime = parseInt(Number(window.localStorage.getItem(this.CountDownType)), 10);
      if (LocalstorageTime === 0 || Number.isNaN(LocalstorageTime)) {
        this.delaySetting = this.SetDelayTimeSec * 1000;
      } else {
        this.delaySetting = LocalstorageTime * 1000;
      }
    },
    RetriveTableContentFrequently() {
      const sec = 1000;
      this.timerId = window.setInterval(() => {
        this.CurrentTime -= sec;

        if (this.CurrentTime <= 0) {
          this.ExcuteUpdate();
        }
      }, sec);
    },
    ExcuteUpdate() {
      this.$emit('UpdateContent');
      this.InitRefreshTime();
      this.CurrentTime = this.delaySetting;
    },
    StopCounting() {
      clearInterval(this.timerId);
    },
    SettingTime() {
      this.SettingMode = !this.SettingMode;
      if (this.SettingMode) {
        this.StopCounting();
      } else {
        this.CompleteSetting();
      }
    },
    CompleteSetting() {
      this.SettingMode = false;

      if (this.settingNumber >= 10 && this.settingNumber <= 60) {
        if (this.CountDownType !== '' || this.CountDownType !== null) {
          window.localStorage.setItem(this.CountDownType, this.settingNumber);
        }
      }

      this.ExcuteUpdate();
      this.RetriveTableContentFrequently();
    },
  },
  destroyed() {
    clearInterval(this.timerId);
  },
};
</script>

<style lang="scss" scoped>
.custom-right-button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0.25em;
  border-bottom-right-radius: 0.25em;
}

.time-setting-input {
  text-align: center;
  width: 70px;
}
</style>
