import { createStore } from "vuex";
import store from "@/store/store";
import shelf from "@/store/shelf";
import goods from "@/store/goods";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    store,
    shelf,
    goods,
  },
});
