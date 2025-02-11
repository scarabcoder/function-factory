import {z} from "zod";
import {makeFunction} from "../src";
import type {InvalidParametersError} from "../src/invalid-parameters.error.ts";

const todoSchema = z.object({
  taskName: z.string().min(1, 'Task name is required'),
  completed: z.boolean().default(false),
  description: z.string().optional().nullable().default(null)
});

const makeTodo = makeFunction(todoSchema, (task) => {
  console.log(`Created task: ${task.taskName}, Completed: ${task.completed}, Description: ${task.description}`);
});


makeTodo({taskName: 'Task with a default null description', completed: false});
// output: Created task: Task with a default null description, Completed: false, Description: null


makeTodo({taskName: 'Task with a description', description: 'This is a description'});
try {
  makeTodo({taskName: '', description: 'Task with a missing name'});
} catch (error: unknown | InvalidParametersError) {
  console.log(`Error!: ${(error as InvalidParametersError).message}`);
}

// @ts-expect-error Property taskName is missing in type {} but required in type { taskName: string; completed?: boolean; description?: string | null; }
makeTodo({});
