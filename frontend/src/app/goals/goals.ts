import { Component, inject, OnInit, signal } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { SmartHttpService } from '../services/smart-http.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goals',
  imports: [Progressbar, CommonModule, FormsModule],
  templateUrl: './goals.html',
  styleUrl: './goals.scss'
})
export class Goals implements OnInit {

  http = inject(SmartHttpService);

  newTaskInput = signal<string>("");
  allTasks = signal<any[]>([]);
  totalTasks = signal<number>(0);
  completedTasks = signal<number>(0);

  ngOnInit(): void {
    this.getTasks()
  }

  getTasks = () => {
    this.http.get("task/get").subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp && resp.status === 200) {
          console.log(resp.data);
          this.allTasks.set(resp.data);
          this.totalTasks.set(resp.data?.length || 0);
          this.completedTasks.set((resp.data?.filter((obj: any) => obj.completed)?.length || 0))
        }
      }
    })
  }

  taskInputChange = (value: string) => {
    this.newTaskInput.set(value);
  }

  addNewTask = () => {
    if (this.newTaskInput()?.trim()?.length === 0) return;
    this.http.post("task/add", {
      task: this.newTaskInput()
    }).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp && resp.status === 200) {
          this.allTasks.update((prev: any[]) => [resp.data, ...prev]);
          console.log(this.allTasks())
          this.totalTasks.update(value => value + 1);
          this.newTaskInput.set("");
        }
      }
    })
  }

  updateTask = (event: any, task_id: number, index: number) => {
    if (event.target.checked) {
      this.completedTasks.update(value => value + 1);
    } else {
      this.completedTasks.update(value => value - 1);
    }
    const allTask = this.allTasks();
    allTask[index].completed = event.target.checked;
    this.allTasks.set(allTask);
    this.http.post("task/update", {
      completed: event.target.checked,
      task_id: task_id
    }).subscribe({
      next: (resp) => {
        console.log(resp);
      }
    })
  }

  deleteTask = (task_id: number, isCompleted:boolean) => {
    let allTask = this.allTasks();
    allTask = allTask.filter((obj: any) => obj.task_id !== task_id);
    this.allTasks.set(allTask);
    this.http.post("task/delete", {
      task_id
    }).subscribe({
      next: (resp) => {
        console.log(resp);
        this.totalTasks.update(value => value - 1);
        if(isCompleted){
          this.completedTasks.update(value => value - 1);
        }
      }
    })
  }

  get progressCount() {
    return this.totalTasks() === 0
      ? 0
      : ((100 * this.completedTasks()) / this.totalTasks())
  }

}
