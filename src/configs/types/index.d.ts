export type Status = 'Pending' | 'In progress' | 'Completed' | null;

export interface Task {
  id: number | null;
  title: string;
  description: string;
  status: Status;
  dueDate: string;
  tags?: string[];
}

export type ButtonType = 'button' | 'submit' | 'reset'; 
