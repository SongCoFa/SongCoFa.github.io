<template>
  <div class="d-inline-block">
    <b-button
      variant="primary"
      size="sm"
      class="mx-1"
      :disabled="!isGroupEditable"
      @click="init"
    >群組編輯</b-button>
    <b-modal
      ref="modal"
      size="md"
      centered
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
      title="群組編輯"
    >
      <InputTool
        :list="groupEditList"
        :inputClasses="['col-sm-6']"
        @updateInput="setInput"
      />
      <template v-slot:modal-footer>
        <b-button
          size="sm"
          block
          variant="primary"
          @click="groupEdit"
        >修改</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import InputTool from '@/components/InputTool/index.vue';

export default {
  name: 'VoucherGroupEdit',
  components: {
    InputTool,
  },
  props: {
    isGroupEditable: Boolean,
  },
  data() {
    return {
      groupEditList: [
        {
          name: 'VoucherVehicle',
          defaultInput: '',
        },
      ],
      selectedInput: {},
    };
  },
  created() {

  },
  computed: {
    isDisabled() {
      return false;
    },
  },
  methods: {
    init() {
      this.$refs.modal.show();
    },
    setInput({ backendFieldName, value }) {
      this.$set(this.selectedInput, backendFieldName, value);
    },
    groupEdit() {
      this.$refs.modal.hide();
      this.$emit('groupEdit', this.selectedInput);
    },
  },
};
</script>
