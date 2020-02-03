import Vue from "vue";
import VueResource from "vue-resource";
import Editor from "./EditorApp.vue";

Vue.config.productionTip = false;

Vue.use(VueResource);

new Vue({
  render: h => h(Editor)
}).$mount("#editor");
