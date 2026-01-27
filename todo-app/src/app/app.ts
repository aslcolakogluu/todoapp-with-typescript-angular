import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'My Todo App';
  newTodoTitle = '';
  todos: Todo[] = [];
  nextId = 1;

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: this.nextId++,
        title: this.newTodoTitle.trim(),
        completed: false
      };
      this.todos.push(newTodo);
      this.newTodoTitle = '';
    }
  }

  toggleTodo(todo: Todo): void {
    todo.completed = !todo.completed;
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
