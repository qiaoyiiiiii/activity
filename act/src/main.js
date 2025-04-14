import "./assets/main.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { checkToken, isLoggedIn, logout } from "./Utils/auth"; // 改为具名导入
import { axiosPlugin } from "./Utils/axios";

// 导入 v-md-editor 相关库
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

// 导入代码高亮
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";

// 配置 v-md-editor
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App);

// 注册自定义指令
app.directive('auth', {
  mounted(el, binding) {
    if (!isLoggedIn()) {
      el.style.display = 'none';
    }
  }
});

app.use(axiosPlugin);
app.use(ElementPlus);
app.use(router);
app.use(VMdEditor);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
