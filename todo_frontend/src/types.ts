export interface ITodo {
  id: string;
  status: Status;
  createdAt: string;
  task: string;
  userId: string;
}

export type Status =  "COMPLETED" | "PENDING";
