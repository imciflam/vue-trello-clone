import { uuid } from "./utils";

export default {
  name: "workshop",
  columns: [
    {
      name: "todo",
      tasks: [
        {
          description: "description",
          name: "first task",
          id: 1,
          userAssigned: null
        },
        {
          description: "description",
          name: "second task",
          id: uuid(),
          userAssigned: null
        },
        {
          description: "",
          name: "third task",
          id: uuid(),
          userAssigned: null
        }
      ]
    },
    {
      name: "in-progress",
      tasks: [
        {
          description: "",
          name: "first task",
          id: uuid(),
          userAssigned: null
        }
      ]
    },
    {
      name: "done",
      tasks: [
        {
          description: "",
          name: "first task",
          id: uuid(),
          userAssigned: null
        }
      ]
    }
  ]
};
