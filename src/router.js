import { createRouter, createWebHashHistory } from "vue-router";
import LayoutHome from "./layouts/Home.vue";
import Home from "./views/Home.vue";

const routes = [
  {
    path: "",
    component: LayoutHome,
    children: [
      {
        path: "",
        component: Home,
      },
    ],
  },
];

let router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
