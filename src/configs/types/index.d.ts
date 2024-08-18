export type Status = 'Pending' | 'In progress' | 'Completed' | null;

export interface Task {
  id: number | null;
  title: string;
  description: string;
  status: Status;
  dueDate: string;
}

export type DesignSystemColors = '--coral-blush' | '--pale-sky' | '--sand-dune' | '--earth-brown' | '--lush-green' | '--white';

export type ButtonType = 'button' | 'submit' | 'reset'; 
