import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "virtual:windi.css";
import "./assets/scss/app.scss";
import store from "./store";

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
