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
  SheetTrigger,
} from "@/components/ui/sheet"
import { QueryObserverBaseResult, RefetchOptions, useMutation } from "@tanstack/react-query"
import { Loader, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "./ui/use-toast"
import { ITodo } from "@/types"


const addTodo = async (task: string) => {
  if (task.length < 5) {
    throw Error("Task length is not big enough to add.");
  }
  const res = await fetch("/api/todos", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": window.localStorage.getItem("session") || ""
    },
    body: JSON.stringify({ task })
  });

  if (res.status !== 200) {
    throw Error("Something went wrong while saving task. Please try again!");
  }

  const todo = await res.json();
  return todo.todo;
}

export const AddTodo = ({ refetchTodos }: {
  refetchTodos: () => void
}) => {
  const [todo, setTodo] = useState("");
  const addTask = useMutation({ mutationFn: addTodo });
  useEffect(() => {
    if (addTask.isError) {
      toast({
        title: "Saving Task Failed",
        description: addTask.error.message
      });
    }

    if (addTask.isSuccess) {
      toast({
        title: "Saved Task",
        description: "Successfully added task"

      });
      refetchTodos();
    }
  }, [addTask.isError, addTask.isSuccess])
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Todo
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Todo</SheetTitle>
          <SheetDescription>
            Add a new todo to your list
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
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" disabled={todo.trim().length < 5} onClick={() => addTask.mutate(todo.trim())}>
              <span>Save</span>
              {addTask.isPending ? <span><Loader className="animate-spin" /></span> : null}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
