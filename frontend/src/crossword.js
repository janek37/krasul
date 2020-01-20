import Vue from "vue";
import VueResource from "vue-resource";
import Crossword from "./CrosswordApp.vue";

Vue.config.productionTip = false;

Vue.use(VueResource);

new Vue({
  render: h => h(Crossword)
}).$mount("#crossword");
