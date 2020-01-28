(function(t){function e(e){for(var n,s,d=e[0],a=e[1],u=e[2],c=0,p=[];c<d.length;c++)s=d[c],Object.prototype.hasOwnProperty.call(i,s)&&i[s]&&p.push(i[s][0]),i[s]=0;for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n]);l&&l(e);while(p.length)p.shift()();return r.push.apply(r,u||[]),o()}function o(){for(var t,e=0;e<r.length;e++){for(var o=r[e],n=!0,d=1;d<o.length;d++){var a=o[d];0!==i[a]&&(n=!1)}n&&(r.splice(e--,1),t=s(s.s=o[0]))}return t}var n={},i={app:0},r=[];function s(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=t,s.c=n,s.d=function(t,e,o){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(s.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(o,n,function(e){return t[e]}.bind(null,n));return o},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/Todo/";var d=window["webpackJsonp"]=window["webpackJsonp"]||[],a=d.push.bind(d);d.push=e,d=d.slice();for(var u=0;u<d.length;u++)e(d[u]);var l=a;r.push([0,"chunk-vendors"]),o()})({0:function(t,e,o){t.exports=o("56d7")},"034f":function(t,e,o){"use strict";var n=o("85ec"),i=o.n(n);i.a},"56d7":function(t,e,o){"use strict";o.r(e);o("e260"),o("e6cf"),o("cca6"),o("a79d");var n=o("2b0e"),i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"todos",attrs:{id:"app"}},[o("h1",{staticClass:"todo_header"},[t._v("備忘錄")]),o("div",{staticClass:"add-new-item"},[o("input",{directives:[{name:"model",rawName:"v-model",value:t.newTodoText,expression:"newTodoText"}],staticClass:"new-item",attrs:{type:"text",placeholder:"加入一個新工作"},domProps:{value:t.newTodoText},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.add(e)},input:function(e){e.target.composing||(t.newTodoText=e.target.value)}}}),o("input",{directives:[{name:"model",rawName:"v-model",value:t.newTodoTime,expression:"newTodoTime"}],staticClass:"new-item",attrs:{type:"text",placeholder:"加入一個時間"},domProps:{value:t.newTodoTime},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.add(e)},input:function(e){e.target.composing||(t.newTodoTime=e.target.value)}}}),o("a",{staticClass:"btn",on:{click:t.add}},[t._v("新增")])]),0!==t.incompleteCount||"show_all"!==t.filter?o("ul",{staticClass:"todo-list"},t._l(t.list,(function(e,n,i){return o("TodoItem",{key:i,staticClass:"todo-item",attrs:{todo:e,filter:t.filter},on:{remove:function(e){return t.del(n)}}})})),1):t._e(),o("div",{staticClass:"control"},[o("a",{staticClass:"btn",class:{active:"show_all"===t.filter},on:{click:function(e){return t.setFilter("show_all")}}},[t._v("全部 ("+t._s(t.allCount)+")")]),o("a",{staticClass:"btn",class:{active:"show_completed"===t.filter},on:{click:function(e){return t.setFilter("show_completed")}}},[t._v("已完成 ("+t._s(t.completedCount)+")")]),o("a",{staticClass:"btn",class:{active:"show_incomplete"===t.filter},on:{click:function(e){return t.setFilter("show_incomplete")}}},[t._v("未完成 ("+t._s(t.incompleteCount)+")")])]),o("input",{directives:[{name:"model",rawName:"v-model",value:t.todosData,expression:"todosData"}],attrs:{type:"hidden"},domProps:{value:t.todosData},on:{input:function(e){e.target.composing||(t.todosData=e.target.value)}}})])},r=[],s=(o("4de4"),o("d81d"),o("b64b"),o("d3b7"),o("ac1f"),o("25f0"),o("5319"),function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{attrs:{id:"TodoItem"}},[o("li",[o("input",{attrs:{type:"checkbox"},domProps:{checked:t.todo.isCompleted},on:{change:function(e){return t.updateStatus(t.todo)}}}),t.todo.isEdit?t._e():o("label",{class:[t.todo.isCompleted?"completed":""]},[t._v(t._s(t.todo.text)+" "),o("font",{attrs:{color:"darkcyan"}},[o("b",[t._v("預計執行時間:")])]),t._v(" "+t._s(t.todo.time))],1),t.todo.isEdit?o("input",{directives:[{name:"model",rawName:"v-model",value:t.todo.text,expression:"todo.text"}],attrs:{type:"text"},domProps:{value:t.todo.text},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.updateTodoText(e,t.todo)},input:function(e){e.target.composing||t.$set(t.todo,"text",e.target.value)}}}):t._e(),t.todo.isEdit?o("input",{directives:[{name:"model",rawName:"v-model",value:t.todo.time,expression:"todo.time"}],attrs:{type:"text"},domProps:{value:t.todo.time},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.updateTodoTime(e,t.todo)},input:function(e){e.target.composing||t.$set(t.todo,"time",e.target.value)}}}):t._e(),t.todo.isEdit?t._e():o("a",{staticClass:"btn",on:{click:function(e){return t.editTodo(t.todo)}}},[t._v("修改")]),o("a",{staticClass:"btn",on:{click:function(e){return t.remove(t.index)}}},[t._v("刪除")])])])}),d=[],a={name:"TodoItem",props:["todo","index","filter"],methods:{remove:function(t){this.$emit("remove")},updateTodoText:function(t,e){t.target.value&&(e.text=t.target.value),e.isEdit=!e.isEdit},updateTodoTime:function(t,e){t.target.value&&(e.time=t.target.value),e.isEdit=!e.isEdit},updateStatus:function(t){t.isCompleted=!t.isCompleted},editTodo:function(t){t.isEdit=!t.isEdit},showCompletedTodo:function(t,e){return!(!t&&"show_completed"===e)}}},u=a,l=o("2877"),c=Object(l["a"])(u,s,d,!1,null,"5e544ac6",null),p=c.exports,f={name:"app",components:{TodoItem:p},data:function(){return{todos:{"a5436691-350c-3ed0-862e-c8abc8509a4a":{uuid:"a5436691-350c-4ed0-862e-c8abc8509a4a",text:"打電話預約晚餐",time:"15:00",isCompleted:!0,isEdit:!1},"a98bf666-a710-33b2-81b2-60c68ec4688d":{uuid:"a98bf666-a710-43b2-81b2-60c68ec4688d",text:"買洗衣粉",time:"16:30",isCompleted:!1,isEdit:!1},"452ef417-033d-38ff-9fec-9d686c105dce":{uuid:"452ef417-033d-48ff-9fec-9d686c105dce",text:"閱讀兩篇文章",time:"18:30",isCompleted:!1,isEdit:!1}},newTodoText:"",newTodoTime:"",filter:"show_all"}},computed:{todosData:function(){return JSON.stringify(this.todos)},list:function(){return"show_all"===this.filter?this.todos:"show_completed"===this.filter?this._getTodos(!0):this._getTodos(!1)},allCount:function(){return Object.keys(this.todos).length},completedCount:function(){var t=this;return Object.keys(this.todos).filter((function(e){return t.todos[e].isCompleted})).length},incompleteCount:function(){var t=this;return Object.keys(this.todos).filter((function(e){return!t.todos[e].isCompleted})).length}},methods:{add:function(){var t=this._uuid();n["a"].set(this.todos,t,{uuid:t,text:this.newTodoText,time:this.newTodoTime,isCompleted:!1,isEdit:!1}),this.newTodoText="",this.newTodoTime=""},del:function(t){n["a"].delete(this.todos,t)},setFilter:function(t){this.filter=t},_uuid:function(){var t=Date.now();return"undefined"!==typeof performance&&"function"===typeof performance.now&&(t+=performance.now()),"xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var o=(t+16*Math.random())%16|0;return t=Math.floor(t/16),("x"===e?o:3&o|8).toString(16)}))},_getTodos:function(t){var e={};for(var o in this.todos)this.todos[o].isCompleted===t&&(e[o]=this.todos[o]);return e},_getObjContent:function(t){return Object.keys(t).map((function(e){return t[e]}))}}},m=f,v=(o("034f"),Object(l["a"])(m,i,r,!1,null,null,null)),x=v.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(x)}}).$mount("#app")},"85ec":function(t,e,o){}});
//# sourceMappingURL=app.4ef61ee5.js.map