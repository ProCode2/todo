import { ITodo } from "@/types";
import { TableCell, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Loader, MoreHorizontal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "./ui/use-toast";
import { EditTodo } from "./EditTodo";


const deleteTodo = async (todoId: string) => {
  const res = await fetch("/api/todos", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      "Authorization": window.localStorage.getItem("session") || ""
    },
    body: JSON.stringify({ todoId })
  });

  if (res.status !== 200) {
    throw Error("Something went wrong while deleting task. Please try again!");
  }

  const todo = await res.json();
  return todo.todo;
}


const editTodoStatus = async ({ todoId, status }: { todoId: string, status: boolean }) => {
  const todoStatus = status ? "COMPLETED" : "PENDING";
  const res = await fetch("/api/todos", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      "Authorization": window.localStorage.getItem("session") || ""
    },
    body: JSON.stringify({ todoId, status: todoStatus })
  });

  if (res.status !== 200) {
    throw Error("Something went wrong while editing task. Please try again!");
  }

  const todo = await res.json();
  return todo.todo;
}


export const TodoItem = ({ todo, refetchTodos }: { todo: ITodo,  refetchTodos: () => void}) => {
  const [showEdit, setShowEdit] = useState(false);
  const delTodo = useMutation({ mutationFn: deleteTodo });
  const changeTodoStatus = useMutation({ mutationFn: editTodoStatus });

  useEffect(() => {
    if (delTodo.isError) {
      toast({
        title: "Could not delete todo",
        description: delTodo.error.message
      });
    }
    if (delTodo.isSuccess) {
      toast({
        title: "Todo Deleted",
        description: "Successfully deleted todo."
      });
      refetchTodos();
    }
    if (changeTodoStatus.isError) {
      toast({
        title: "Could not edit todo",
        description: changeTodoStatus.error.message
      });
    }

    if (changeTodoStatus.isSuccess) {
      toast({
        title: "Todo Saved",
        description: "Successfully saved todo."
      });
      refetchTodos();
    }
  }, [changeTodoStatus.isError, changeTodoStatus.isSuccess, delTodo.isError, delTodo.isSuccess])

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        {changeTodoStatus.isPending ? <Loader className="animate-spin" /> :
          <Checkbox checked={todo.status === "COMPLETED"} onCheckedChange={(v) => changeTodoStatus.mutate({ todoId: todo.id, status: v === "indeterminate" ? false : v })} />}
      </TableCell>
      <TableCell className="font-medium">
        {todo.task}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{todo.status === "COMPLETED" ? "completed" : "pending"}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(todo.createdAt).toDateString()}{" "}{new Date(todo.createdAt).toTimeString().slice(0, 9)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setShowEdit(!showEdit)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => delTodo.mutate(todo.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <EditTodo refetchTodos={refetchTodos} task={todo} show={showEdit} closeFn={() => setShowEdit(false)} />
    </TableRow>


  );
}
