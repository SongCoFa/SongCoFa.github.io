<template>
  <div>
{{ message }}
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...';
    },
  },
};
</script>
