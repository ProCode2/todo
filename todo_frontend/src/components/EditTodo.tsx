import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useMutation } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "./ui/use-toast"
import { ITodo, Status } from "@/types"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"


const editTodo = async ({ todoId, task, status }: { todoId: string, task?: string, status?: Status }) => {
  const res = await fetch("/api/todos", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      "Authorization": window.localStorage.getItem("session") || ""
    },
    body: JSON.stringify({ todoId, task, status })
  });

  if (res.status !== 200) {
    throw Error("Something went wrong while editing task. Please try again!");
  }

  const todo = await res.json();
  return todo.todo;
}

export const EditTodo = ({ task, show, closeFn, refetchTodos }: {
  task: ITodo;
  show: boolean;
  closeFn: () => void
  refetchTodos: () => void
}) => {
  const [todo, setTodo] = useState(task.task);
  const [status, setStatus] = useState<Status>(task.status);
  const modTodo = useMutation({ mutationFn: editTodo });
  useEffect(() => {
    if (modTodo.isError) {
      toast({
        title: "Could not edit todo",
        description: modTodo.error.message
      });
    }

    if (modTodo.isSuccess) {
      toast({
        title: "Todo Saved",
        description: "Successfully saved todo."
      });

      refetchTodos();
    }
  }, [modTodo.isError, modTodo.isSuccess])
  return (
    <Sheet onOpenChange={() => closeFn()} open={show}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Todo</SheetTitle>
          <SheetDescription>
            Edit this todo
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task" className="text-right">
              Task
            </Label>
            <Input id="Task" value={todo} onChange={(e) => setTodo(e.target.value)} placeholder="Earn the most I can" className="col-span-3" />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(v: Status) => setStatus(v)} >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status of your task" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" disabled={todo.trim().length < 5} onClick={() => {
              modTodo.mutate({ task: todo.trim(), todoId: task.id, status });
              closeFn();
            }}>
              <span>Save</span>
              {modTodo.isPending ? <span><Loader className="animate-spin" /></span> : null}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
