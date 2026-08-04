export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  state?: 'open' | 'closed';
}
