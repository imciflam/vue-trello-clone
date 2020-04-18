import Vue from "vue";
import Vuex from "vuex";
import defaultBoard from "./default-board";
import { saveStatePlugin } from "./utils";

Vue.use(Vuex);

const board = JSON.parse(localStorage.getItem("board")) || defaultBoard; // get a board from localStorage if we can

export default new Vuex.Store({
  plugins: [saveStatePlugin],
  state: {
    board
  },
  getters: {
    getTask(state) {
      // getting task by id
      return id => {
        for (const column of state.board.columns) {
          for (const task of column.tasks) {
            if (task.id == id) {
              // equality, not identity!
              return task;
            }
          }
        }
      };
    }
  },

  mutations: {}
});
