<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div
        class="column"
        v-for="(column, $colInd) of board.columns"
        :key="$colInd"
        draggable
        @drop="moveTaskOrColumn($event, column.tasks, $colInd)"
        @dragover.prevent
        @dragenter.prevent
        @dragstart.self="pickupColumn($event, $colInd)"
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
            @dragover.prevent
            @dragenter.prevent
            @drop.stop="moveTaskOrColumn($event, column.tasks, $colInd,$taskInd)"
          >
            <!--stopping propagation event from moving up so we wpn't get event x 2 on parent -->
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
      <div class="column flex">
        <input
          type="text"
          class="p-2 mr-2 flex-grow"
          placeholder="New Column Name"
          v-model="newColumnName"
          @keyup.enter="createColumn"
        />
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
  // the local state
  data() {
    return {
      newColumnName: ""
    };
  },
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

    createColumn() {
      this.$store.commit("CREATE_COLUMN", {
        name: this.newColumnName
      });
      this.newColumnName = "";
    },
    pickupTask(e, taskIndex, fromColumnIndex) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("from-task-index", taskIndex); // allows only string
      e.dataTransfer.setData("from-column-index", fromColumnIndex);
      e.dataTransfer.setData("type", "task");
    },

    pickupColumn(e, fromColumnIndex) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("from-column-index", fromColumnIndex);
      e.dataTransfer.setData("type", "column");
    },
    moveTaskOrColumn(e, toTasks, toColumnIndex, toTaskIndex) {
      const type = e.dataTransfer.getData("type");
      if (type === "task") {
        // if undefined, then put the task to the end - because we are dragging a task on the column
        this.moveTask(
          e,
          toTasks,
          toTaskIndex !== undefined ? toTaskIndex : toTask.length
        );
      } else {
        this.moveColumn(e, toColumnIndex);
      }
    },

    moveTask(e, toTasks, toTaskIndex) {
      const fromColumnIndex = e.dataTransfer.getData("from-column-index"); // we set it before
      const fromTasks = this.board.columns[fromColumnIndex].tasks;
      const fromTaskIndex = e.dataTransfer.getData("from-task-index");
      this.$store.commit("MOVE_TASK", {
        fromTasks,
        fromTaskIndex, // index of the task we want to move
        toTasks,
        toTaskIndex
      });
    },
    moveColumn(e, toColumnIndex) {
      const fromColumnIndex = e.dataTransfer.getData("from-column-index");
      this.$store.commit("MOVE_COLUMN", {
        fromColumnIndex,
        toColumnIndex
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
