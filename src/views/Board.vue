<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div
        class="column"
        v-for="(column, $colInd) of board.columns"
        :key="$colInd"
        @drop="moveTask($event, column.tasks)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="flex items-center mb-2 font-bold">{{column.name}}</div>
        <div class="list-reset">
          <div
            class="task"
            v-for="(task, $taskInd) of column.tasks"
            :key="$taskInd"
            draggable
            @dragstart="pickupTask($event, $taskInd, $colInd)"
            @click="goToTask(task)"
          >
            <span class="w-full flex-no-shrink font-bold">{{task.name}}</span>
            <p
              v-if="task.description"
              class="w-full flex-no-shrink mt-1 text-sm"
            >{{task.description}}</p>
          </div>

          <input
            type="text"
            class="block p-2 w-full bg-transparent"
            placeholder="+ add a new task"
            @keyup.enter="createTask($event, column.tasks)"
          />
        </div>
      </div>
    </div>
    <div class="task-bg" v-if="isTaskOpen" @click.self="close">
      <!--click anywhere but the element-->
      <router-view />
    </div>
  </div>
</template>



<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["board"]),
    isTaskOpen() {
      return this.$route.name === "task"; // name of the router view
    }
  },
  methods: {
    goToTask(task) {
      this.$router.push({ name: "task", params: { id: task.id } });
    },
    close() {
      this.$router.push({ name: "board" }); // go back to the board
    },
    createTask(e, tasks) {
      // event and the task list
      this.$store.commit("CREATE_TASK", {
        tasks,
        name: e.target.value // data from an input
      });
      e.target.value = ""; // clear the inputs
    },
    pickupTask(e, taskIndex, fromColumnIndex) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("task-index", taskIndex); // allows only string
      e.dataTransfer.setData("from-column-index", fromColumnIndex);
    },
    moveTask(e, toTasks) {
      const fromColumnIndex = e.dataTransfer.getData("from-column-index"); // we set it before
      const fromTasks = this.board.columns[fromColumnIndex].tasks;
      const taskIndex = e.dataTransfer.getData("task-index");
      this.$store.commit("MOVE_TASK", {
        fromTasks,
        toTasks,
        taskIndex // index of the task we want to move
      });
    }
  }
};
</script>

<style type="text/postcss">
.task {
  @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
}

.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}

.board {
  @apply p-4 bg-teal-dark h-full overflow-auto;
}

.task-bg {
  @apply pin absolute;
  background: rgba(0, 0, 0, 0.5);
}
</style>
