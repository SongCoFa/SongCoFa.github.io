<template>
  <div>
    <b-button
      variant="primary"
      size="sm"
      class="mx-1"
      @click="$refs.modal.show();init()"
      :disabled="item.in_deleted || item.selected || !writable"
    >
      <font-awesome-icon :icon="['far', 'edit']" />
    </b-button>
    <b-modal
      ref="modal"
      centered
      scrollable
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
      :title="modalTitle"
      size="xl"
    >
      <InputTool
        :list="EditableList"
        :inputClasses="['col-sm-6']"
        @updateInput="setInput"
        @validateRequired="isEditRequired = $event"
      />
      <template v-slot:modal-footer>
        <b-button
          size="sm"
          block
          variant="primary"
          :disabled="!isAbleToEdit"
          @click="handleOk"
        >修改</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import InputTool from '@/components/InputTool/index.vue';

export default {
  name: 'VoucherEdit',
  components: {
    InputTool,
  },
  props: {
    fields: Array,
    item: Object,
    writable: Boolean,
  },
  data() {
    return {
      EditableList: [],
      selectedInput: {},

      isEditRequired: false,
    };
  },
  mounted() {
    this.EditableList = this.fields
      .filter(field => field.customize.editable === true)
      .map(field => ({
        name: field.customize.name,
        defaultInput: this.item[field.key],
        isRequired: field.customize.isRequired,
      }));
  },
  computed: {
    modalTitle() {
      return `${this.$route.name}-編輯`;
    },
    isAbleToEdit() {
      // 有經過編輯且符合必填屬性
      return this.isEditRequired && Object.keys(this.selectedInput).some(prop => this.item[prop] !== this.selectedInput[prop]);
    },
  },
  methods: {
    init() {
      this.EditableList = this.fields
        .filter(field => field.customize.editable === true)
        .map(field => ({
          name: field.customize.name,
          defaultInput: this.item[field.key],
          isRequired: field.customize.isRequired || false,
        }));
    },
    setInput({ backendFieldName, value }) {
      this.$set(this.selectedInput, backendFieldName, value);
    },
    handleOk() {
      const send = [Object.assign({}, this.item, this.selectedInput)];
      this.$set(send[0], 'in_edited', true);
      this.$emit('storedEdit', send);

      this.$refs.modal.hide();
    },
  },
};
</script>
