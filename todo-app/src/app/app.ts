import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, FilterType, CategoryType } from './todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Enhanced Todo App';

  // Form inputs
  newTodoTitle = '';
  newTodoCategory: CategoryType = 'Personal';
  newTodoPriority: 'high' | 'medium' | 'low' = 'medium';
  newTodoDueDate = '';

  // Todo list
  todos: Todo[] = [];
  nextId = 1;

  // Filters
  filterType: FilterType = 'all';
  selectedCategory: CategoryType = 'All';
  searchText = '';

  // Categories list
  categories: CategoryType[] = ['All', 'Work', 'Personal', 'Shopping', 'Health', 'Other'];

  // Edit mode
  editingId: number | null = null;
  editTitle = '';

  ngOnInit(): void {
    this.loadTodosFromStorage();
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: this.nextId++,
        title: this.newTodoTitle.trim(),
        completed: false,
        category: this.newTodoCategory,
        priority: this.newTodoPriority,
        dueDate: this.newTodoDueDate ? new Date(this.newTodoDueDate) : undefined,
        createdAt: new Date()
      };
      this.todos.push(newTodo);
      this.resetForm();
      this.saveTodosToStorage();
    }
  }

  resetForm(): void {
    this.newTodoTitle = '';
    this.newTodoCategory = 'Personal';
    this.newTodoPriority = 'medium';
    this.newTodoDueDate = '';
  }

  toggleTodo(todo: Todo): void {
    todo.completed = !todo.completed;
    this.saveTodosToStorage();
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodosToStorage();
  }

  startEdit(todo: Todo): void {
    this.editingId = todo.id;
    this.editTitle = todo.title;
  }

  saveEdit(todo: Todo): void {
    if (this.editTitle.trim()) {
      todo.title = this.editTitle.trim();
      this.editingId = null;
      this.saveTodosToStorage();
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editTitle = '';
  }

  setFilterType(type: string): void {
    this.filterType = type as FilterType;
  }

  // Filtering
  get filteredTodos(): Todo[] {
    return this.todos.filter(todo => {
      // Filter by completion status
      const statusMatch =
        this.filterType === 'all' ? true :
        this.filterType === 'active' ? !todo.completed :
        todo.completed;

      // Filter by category
      const categoryMatch =
        this.selectedCategory === 'All' ? true :
        todo.category === this.selectedCategory;

      // Filter by search text
      const searchMatch =
        this.searchText === '' ? true :
        todo.title.toLowerCase().includes(this.searchText.toLowerCase());

      return statusMatch && categoryMatch && searchMatch;
    });
  }

  get activeTodoCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }

  get completedTodoCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

  // Check if todo is overdue
  isOverdue(todo: Todo): boolean {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  }

  // LocalStorage
  saveTodosToStorage(): void {
    // Check if we're in the browser (not SSR)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(this.todos));
      localStorage.setItem('nextId', this.nextId.toString());
    }
  }

  loadTodosFromStorage(): void {
    // Check if we're in the browser (not SSR)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTodos = localStorage.getItem('todos');
      const savedNextId = localStorage.getItem('nextId');

      if (savedTodos) {
        this.todos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          createdAt: new Date(todo.createdAt)
        }));
      }

      if (savedNextId) {
        this.nextId = parseInt(savedNextId, 10);
      }
    }
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(t => !t.completed);
    this.saveTodosToStorage();
  }
}
