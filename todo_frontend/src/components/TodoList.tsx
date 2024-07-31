import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";
import { ITodo } from "@/types";
import { TodoItem } from "./TodoItem";

export const TodoList = ({ todos, refetchTodos }: {
  todos: ITodo[];
  refetchTodos: () => void
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>
          Manage your tasks and track every last detail.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Change Status</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Created at
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              todos.map(todo => (
                <TodoItem refetchTodos={refetchTodos} todo={todo} />
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
