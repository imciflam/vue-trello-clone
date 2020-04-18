import Vue from "vue";
import Vuex from "vuex";
import defaultBoard from "./default-board";
import { saveStatePlugin, uuid } from "./utils";

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
  mutations: {
    CREATE_TASK(state, { tasks, name }) {
      tasks.push({
        // passed just a fragment of state (tasks)
        name,
        id: uuid(),
        description: ""
      });
    },
    CREATE_COLUMN(state, { name }) {
      state.board.columns.push({
        name,
        tasks: []
      });
    },
    UPDATE_TASK(state, { task, key, value }) {
      // Vue.set(task, key, value); also ok
      task[key] = value; // to be able to mutate both name and description
    }
  }
});
