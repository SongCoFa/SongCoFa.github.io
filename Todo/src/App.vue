<template>
  <div id="app" class="todos">
    <h1 class="todo_header">備忘錄</h1>

    <div class="add-new-item">
      <input type="text" v-model="newTodoText" v-on:keyup.enter="add" placeholder="加入一個新工作" class="new-item" />
      <input type="text" v-model="newTodoTime" v-on:keyup.enter="add" placeholder="加入一個時間" class="new-item" />
      <a v-on:click="add" class="btn">新增</a>
    </div>

    <ul class="todo-list" v-if="!(incompleteCount === 0 && filter === 'show_all')">
      <TodoItem v-for="(todo, key, index) in list" :todo="todo" :key="index" :filter="filter" class="todo-item" v-on:remove="del(key)"></TodoItem>
    </ul>

    <div class="control">
      <a v-on:click="setFilter('show_all')" class="btn" :class="{ active: filter === 'show_all'}">全部 ({{ allCount }})</a>
      <a v-on:click="setFilter('show_completed')" class="btn" :class="{ active: filter === 'show_completed'}">已完成 ({{ completedCount }})</a>
      <a v-on:click="setFilter('show_incomplete')" class="btn" :class="{ active: filter === 'show_incomplete'}">未完成 ({{ incompleteCount }})</a>
    </div>

    <input type="hidden" v-model="todosData">
        
  </div>
</template>

<script>
import Vue from 'vue'
import TodoItem from './components/TodoItem.vue'

export default {
  name: 'app',
  components: {
    TodoItem
  },
  data(){
    return{
      todos: {
        "a5436691-350c-3ed0-862e-c8abc8509a4a": {
          "uuid": "a5436691-350c-4ed0-862e-c8abc8509a4a",
          "text": "打電話預約晚餐",
          "time":"15:00",
          "isCompleted": true,
          "isEdit": false
        },
        "a98bf666-a710-33b2-81b2-60c68ec4688d": {
          "uuid": "a98bf666-a710-43b2-81b2-60c68ec4688d",
          "text": "買洗衣粉",
          "time":"16:30",
          "isCompleted": false,
          "isEdit": false
        },
        "452ef417-033d-38ff-9fec-9d686c105dce": {
          "uuid": "452ef417-033d-48ff-9fec-9d686c105dce",
          "text": "閱讀兩篇文章",
          "time":"18:30",
          "isCompleted": false,
          "isEdit": false
        }
      },
      newTodoText: '',
      newTodoTime: '',
      filter: 'show_all'
    }
  },
  computed: {
      todosData: function() {
        return JSON.stringify(this.todos);
      },
      list: function() {
        if(this.filter === 'show_all') {
          return this.todos;
        } else if (this.filter === 'show_completed') {
          return this._getTodos(true);
        } else { //show_incomplete
          return this._getTodos(false);
        }
      },
      allCount: function() {
        return Object.keys(this.todos).length;
      },
      completedCount: function() {
        var _this = this;
  
        return Object.keys(this.todos).filter(function(value) {
          return _this.todos[value].isCompleted
        }).length;
      },
      incompleteCount: function() {
        var _this = this;
  
        return Object.keys(this.todos).filter(function(value) {
          return !_this.todos[value].isCompleted
        }).length;
      }
    },
    methods: {
      add: function() {
        var id = this._uuid();
  
        Vue.set(this.todos, id, {
          uuid: id,
          text: this.newTodoText,
          time: this.newTodoTime,
          isCompleted: false,
          isEdit: false
        });
  
        this.newTodoText = '';
        this.newTodoTime = '';
      },
      del: function(index) {
        Vue.delete(this.todos, index);
      },
      setFilter: function(filter) {
        this.filter = filter;
      },
      _uuid: function() {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },
      _getTodos: function(isCompleted) {
        var list = {};
  
        for(let index in this.todos) {
          if(this.todos[index].isCompleted === isCompleted) {
            list[index] = this.todos[index];
          }
        }
        return list;
      },
      _getObjContent: function (data) {
        return  Object.keys(data).map(function(index){
          return data[index];
        });
      }
    }
}
</script>

<style>
  html {
    background: rgb(55, 113, 126);
    font-family: '微軟正黑體', sans-serif;
  }
  
  .todos {
    background: #fff;
    border-radius: 10px;
    width: 40vw;
    height: 50vh;
    margin: 20px auto;
    padding: 15px;
  }
  
  .todo_header {
    width: 130px;
    font-size: 40px;
    margin: 0 auto 15px;
  }
  
  .add-new-item {
    font-size: 17px;
  }
  
  .todo-list {
    font-size: 17px;
    color: #5a5a5a;
    margin: 20px -20px; 
  }
  
  .msg {
    font-size: 15px;
    color: #363636;
  }
  
  .btn {
    border: 1px solid #ccc;
    border-radius: 10px;
    cursor: pointer;
    display: inline-block;
    margin: 0px 10px;
    padding: 3px 10px;
    min-width: 30px;
    text-align: center;
    transition-duration: 0.5s;
  }
  
  .btn:hover, .btn.active {
    background: rgb(102, 101, 101);
    color: #fff;
  }
  
  .control {
    border-top: 1px solid #ddd;
    color: #525252;
    font-size: 15px;
    padding: 15px 0 0 0;
  }
  
  .mb {
    margin: 0 0 15px 0;
  }
  
  .completed {
    text-decoration: line-through;
  }
  
  input[type=text] {
    border: 1px solid #ddd;
    border-radius: 11px;
    background-color: #2b2a2a;
    color: #cecccc;
    line-height: 1.2;
    height: 25px;
    padding: 5px;
  }
</style>
