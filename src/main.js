import Vue from "vue";
import router from "./router";
import store from "./store";
import Axios from "axios";
import qs from "qs";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCodeMirror from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import * as filters from "./filters";
import util from "./util";
import "./assets/theme/ide.css";
//import "./assets/icons/iconfont.css";
import App from "./App.vue";

Vue.config.productionTip = true; //阻止启动生产消息,开发模式下为true,生产模式下为false
Vue.prototype.$axios = Axios;
Vue.prototype.$qs = qs;

Axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

// http请求拦截器
Axios.interceptors.request.use(
  config => {
    if (store.state.qaz) {
      config.headers[store.state.qaz] = store.state.wsx;
    }
    if (config.method == "post") {
      // config.data = qs.stringify(config.data);
    }
    // if (config.method == "delete") {
    //   config.data = qs.stringify(config.data, {
    //     arrayFormat: 'repeat'
    //   });
    //   alert(qs.stringify(config.data, {
    //     arrayFormat: 'repeat'
    //   }));
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http响应拦截器
Axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

Vue.use(ElementUI);
Vue.use(VueCodeMirror);

// 遍历所有导出的过滤器并添加到全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.use(util);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
