<template>
  <div id="TodoItem">
    <li>
      <input type="checkbox" v-on:change="updateStatus(todo)" :checked="todo.isCompleted" />
      <label
        v-if="!todo.isEdit"
        v-bind:class="[todo.isCompleted ? 'completed' : '']"
      >{{ todo.text }} 
      <font color="darkcyan"><b>預計執行時間:</b></font>
      {{todo.time}}</label>
      <input
        type="text"
        v-if="todo.isEdit"
        v-on:keyup.enter="updateTodoText($event, todo)"
        v-model="todo.text"
      />
      <input
        type="text"
        v-if="todo.isEdit"
        v-on:keyup.enter="updateTodoTime($event, todo)"
        v-model="todo.time"
      />
      <a v-on:click="editTodo(todo)" v-if="!todo.isEdit" class="btn">修改</a>
      <a v-on:click="remove(index)" class="btn">刪除</a>
    </li>
  </div>
</template>

<script>
export default {
  name: "TodoItem",
  props:['todo', 'index', 'filter'],
  methods: {
      remove: function(index) {
        this.$emit('remove');
      },
      updateTodoText: function($event, todo) {
        if($event.target.value) {
          todo.text = $event.target.value;
        }
        todo.isEdit = !todo.isEdit;
      },
      updateTodoTime: function($event, todo) {
        if($event.target.value) {
          todo.time = $event.target.value;
        }
        todo.isEdit = !todo.isEdit;
      },
      updateStatus: function(todo) {
        todo.isCompleted = !todo.isCompleted;
      },
      editTodo: function(todo) {
        todo.isEdit = !todo.isEdit;
      },
      showCompletedTodo: function(isCompleted, filter) {
        return !(!isCompleted && filter === 'show_completed');
      }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
