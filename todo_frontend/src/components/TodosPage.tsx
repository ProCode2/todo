import {
  Search,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { AddTodo } from "./AddTodo"
import { ITodo } from "@/types"
import { useEffect, useState } from "react"
import { TodoList } from "./TodoList"
import { useNavigate } from "react-router-dom"
import { toast } from "./ui/use-toast"

const getTodos = async () => {
  const res = await fetch("/api/todos", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": window.localStorage.getItem("session") || ""
    }
  });

  if (res.status !== 200) {
    throw Error("Something went wrong while loading your todos., Please try again!");
  }

  const todos = await res.json();
  console.log(todos);

  return todos.todos;
}


export const TodosPage = () => {
  const [completed, setCompleted] = useState<ITodo[]>([]);
  const [pending, setPending] = useState<ITodo[]>([]);
  const [search, setSearch] = useState("");
  const todosQuery = useQuery<ITodo[]>({ queryKey: ["get-todos"], queryFn: getTodos });
  const navigate = useNavigate();
  useEffect(() => {
    const loggedIn = window.localStorage.getItem("session");
    if (!loggedIn) {
      toast({
        title: "Please login to continue",
        description: "You are not authenticated, Please login and try again!"
      });
      navigate("/login");
    }
    if (!todosQuery.data) {
      return;
    }
    // divide all todos into two sections: pending and completed
    const dividedTodos = todosQuery.data.filter(t => t.task.includes(search)).reduce((acc: { pending: ITodo[], completed: ITodo[] }, cur: ITodo) => {
      if (cur.status === "PENDING") {
        acc.pending.push(cur);
      } else if (cur.status === "COMPLETED") {
        acc.completed.push(cur);
      }
      return acc;
    }, { pending: [], completed: [] });
    setCompleted(dividedTodos.completed);
    setPending(dividedTodos.pending)
  }, [todosQuery.data, search]);

  const refetchTodos = () => {
    todosQuery.refetch()
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <AddTodo refetchTodos={refetchTodos} />
              </div>
            </div>
            {
              todosQuery.isPending ? <div>Loading Todos</div> : null
            }
            {todosQuery.isSuccess ? <>

              <TabsContent value="all">
                <TodoList refetchTodos={refetchTodos} todos={todosQuery.data.filter(t => t.task.toLowerCase().includes(search))} />
              </TabsContent>
              <TabsContent value="pending">
                <TodoList refetchTodos={refetchTodos} todos={pending} />
              </TabsContent>
              <TabsContent value="completed">
                <TodoList refetchTodos={refetchTodos} todos={completed} />
              </TabsContent>
            </> : null}
          </Tabs>
        </main>
      </div>
    </div>
  )
}


