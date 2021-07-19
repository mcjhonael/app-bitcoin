import Vue from "vue";
import Router from "vue-router";

import Home from "@/views/Home";
import About from "@/views/About";
import Error from "@/views/Error";
import CoinDetail from "@/views/CoinDetail";
Vue.use(Router);

//creamos una nueva instancia del router y dentro establecemos la config
export default new Router({
  //utiliza el history mode de html
  mode: "history",
  //un array de rutas cada ruta va ser un objeto
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/about", name: "about", component: About },
    { path: "/coin/:id", name: "coin-detail", component: CoinDetail },
    { path: "*", name: "Error", component: Error },
  ],
});
