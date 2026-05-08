import { Locale } from "vant";
import zhCN from "vant/es/locale/lang/zh-CN";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "vant/lib/index.css";
import "./index.css";

Locale.use("zh-CN", zhCN);

const app = createApp(App);
app.use(router);
app.mount("#app");
