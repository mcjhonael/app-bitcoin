import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/tailwind.css";
import { Chart } from "chart.js";
import Chartkick from "vue-chartkick";
import { VueSpinners } from "@saeris/vue-spinners";
import router from "@/router";
import { dollarFilter, percentFilter } from "@/filters";

Vue.filter("dollar", dollarFilter);
Vue.filter("percent", percentFilter);

Vue.use(VueSpinners);
Vue.use(Chartkick.use(Chart));
Vue.config.productionTip = false;
// para poder usar ese filter dentro de vue nombre del filtro  y la funcion que se va  ejecutar para vez que se llame al filtro

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
