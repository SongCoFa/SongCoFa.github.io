<template>
  <b-form-group :label="descript">
    <div class="d-inline-block col-6 pl-0">
      <b-form-input
        type="date"
        v-model="date"
        :value="date"
        :state="dateState"
        trim
      />
    </div>
    <div class="d-inline-block col-6 pr-0">
      <b-form-input
        type="time"
        v-model="time"
        :value="time"
        :state="timeState"
        trim
      />
    </div>
  </b-form-group>
</template>

<script>
export default {
  name: 'VoucherDeparture',
  components: {
  },
  props: {
    defaultInput: String,
    required: Boolean,
  },
  data() {
    return {
      // TODO: defaultInput in date & time
      date: this.defaultInput ? this.defaultInput.split('T')[0] : this.defaultInput,
      time: this.defaultInput ? this.defaultInput.split('T')[1] : this.defaultInput,
      backendFieldName: 'departure',
      descript: '預估發車時間',
    };
  },
  watch: {
    date(value) {
      let temp = value;
      if (temp === '') {
        temp = null;
      }
      this.formateDateTime();
    },
    time(value) {
      let temp = value;

      if (temp === '') {
        temp = null;
      }

      this.formateDateTime();
    },
  },
  computed: {
    dateState() {
      return this.required ? !!this.date : null;
    },
    timeState() {
      return this.required ? !!this.time : null;
    },
  },
  created() {
    if (this.defaultInput && this.defaultInput !== '') {
      const dateTime = this.$moment(this.defaultInput, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm');
      let a = '';
      let b = '';
      [a, b] = dateTime.split('T');
      this.date = a;
      this.time = b;
    } else {
      const now = this.$moment().format('YYYY-MM-DDTHH:mm');
      let a = '';
      let b = '';
      [a, b] = now.split('T');
      this.date = a;
      this.time = b;
    }
  },
  methods: {
    formateDateTime() {
      // 和原始資料對應的格式
      let value = `${this.date}T${this.time}:00`;

      if (this.date == null || this.time == null) {
        value = null;
      }

      const send = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value,
        state: this.dateState && this.timeState,
      };

      this.$emit('updateInput', send);
    },
  },
};
</script>
