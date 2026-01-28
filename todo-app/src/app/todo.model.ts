export interface Todo{
  id: number;
  title: string;
  completed: boolean;
  category: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  createdAt: Date;
  }

export type FilterType = 'all' | 'active' | 'completed';
export type CategoryType = 'All' | 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Other';

