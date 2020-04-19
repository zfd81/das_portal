// 根级别的 mutation

const mutations = {
  login(state, data) {
    state.qaz = data.headers["atn"];
    state.wsx = data.headers["atv"];
    state.user = data.user;
    window.sessionStorage.setItem("qazwsx", JSON.stringify(data.headers));
    window.sessionStorage.setItem("user", JSON.stringify(data.user));
  },
  logout(state) {
    state.qaz = null;
    state.wsx = null;
    state.user = {};
    window.sessionStorage.clear();
  },
  sourceViewName(state, name) {
    state.sourceViewName = name;
  }
};

export default mutations;
