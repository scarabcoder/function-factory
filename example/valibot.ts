import {
  object,
  string,
  boolean,
  nullable,
  minLength,
  pipe, optional,
} from 'valibot';
import {makeFunction} from '../src';
import type {InvalidParametersError} from '../src/invalid-parameters.error.ts';

const todoSchema = object({
  taskName: pipe(
    string(),
    minLength(1, 'Task name is required'),
  ),
  completed: optional(boolean(), false),
  description: optional(nullable(string()), null),
});

const makeTodo = makeFunction(todoSchema, (task) => {
  console.log(
    `Created task: ${task.taskName}, Completed: ${task.completed}, Description: ${task.description}`,
  );
});

makeTodo({
  taskName: 'Task with a default null description',
  completed: false,
});

makeTodo({
  taskName: 'Task with a description',
  description: 'This is a description',
});

try {
  makeTodo({taskName: '', description: 'Task with a missing name'});
} catch (error: unknown | InvalidParametersError) {
  console.log(`Error!: ${(error as InvalidParametersError).message}`);
}

try {
  // Property 'taskName' is missing in type '{}'
  // but required in type '{ taskName: string; completed?: boolean; description?: string | null; }'
  // @ts-expect-error
  makeTodo({});
} catch (error: unknown | InvalidParametersError) {
  console.log(`Error!: ${(error as InvalidParametersError).message}`);
}
