import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import Moment from "moment";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

Vue.filter("formatDate", (value: Moment.MomentInput) => {
  return Moment(value).format("YYYY-MM-DD HH:mm:ss");
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
