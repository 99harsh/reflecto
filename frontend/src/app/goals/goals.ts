import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { SmartHttpService } from '../services/smart-http.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Skeleton } from '../shared/skeleton/skeleton';
import { trigger, style, transition, animate } from '@angular/animations';

interface TaskLoading{
  userTasksLoading:boolean,
  statsLoading:boolean
};

@Component({
  selector: 'app-goals',
  imports: [Progressbar, CommonModule, FormsModule, Skeleton],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
  animations: [
      // Content slide in
    trigger('slideUpIn', [
      transition(':enter', [
        style({ transform: 'translateX(10px', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class Goals implements OnInit {

  http = inject(SmartHttpService);

  newTaskInput = signal<string>("");
  allTasks = signal<any[]>([]);
  totalTasks = signal<number>(0);
  completedTasks = signal<number>(0);
  progress = signal<any>({});
  loading = signal<TaskLoading>({
    userTasksLoading: true,
    statsLoading: true
  })


  ngOnInit(): void {
    this.getTasks();
    this.getTasksProgress();
  }

  getTasks = () => {
    this.http.get("task/get").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.allTasks.set(resp.data);
          this.totalTasks.set(resp.data?.length || 0);
          this.completedTasks.set((resp.data?.filter((obj: any) => obj.completed)?.length || 0));
          this.loading.update((prev:TaskLoading) => ({
            ...prev,
            userTasksLoading: false
          }))
        }
      }
    })
  }

  private getTasksProgress() {
    this.http.get("stats/tasks").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.progress.set(resp.data);
             this.loading.update((prev:TaskLoading) => ({
            ...prev,
            statsLoading: false
          }))
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
        if (resp && resp.status === 200) {
          this.allTasks.update((prev: any[]) => [resp.data, ...prev]);
          this.totalTasks.update(value => value + 1);
          this.newTaskInput.set("");
          const totalTasks = Number(this.progress().total_tasks) + 1;
          const completedTask = Number(this.progress().completed_tasks);
            this.progress.update((prev: any) => ({
            ...prev,
            total_tasks: prev.total_tasks + 1,
            success_rate: this.getSuccessRate(completedTask, totalTasks) // update this as needed, e.g. +1 if new task is completed
            }));

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
      next: (resp:any) => {
        if(resp && resp.status === 200){
          const totalTasks = Number(this.progress().total_tasks);
          const completedTask = event.target.checked ? Number(this.progress().completed_tasks) + 1 : Number(this.progress().completed_tasks) - 1;
          this.progress.update((prev: any) => ({
            ...prev,
            completed_tasks: completedTask,
            success_rate: this.getSuccessRate(completedTask, totalTasks) // update this as needed, e.g. +1 if new task is completed
            }));
        }
      }
    })
  }

  deleteTask = (task_id: number, isCompleted: boolean) => {
    let allTask = this.allTasks();
    allTask = allTask.filter((obj: any) => obj.task_id !== task_id);
    this.allTasks.set(allTask);
    this.http.post("task/delete", {
      task_id
    }).subscribe({
      next: (resp) => {
        this.totalTasks.update(value => value - 1);
        if (isCompleted) {
          this.completedTasks.update(value => value - 1);
        }
        const totalTasks = Number(this.progress().total_tasks) - 1;
        const completedTask = isCompleted ? Number(this.progress().completed_tasks) - 1 : Number(this.progress().completed_tasks);
        this.progress.update((prev: any) => ({
          ...prev,
          total_tasks: totalTasks,
          completed_tasks: completedTask,
          success_rate: this.getSuccessRate(completedTask, totalTasks) // update this as needed, e.g. +1 if new task is completed
        }));
        
      }
    })
  }

  private getSuccessRate(completedTasks:any, allTasks:any) {
    if (allTasks === 0) return 0; // avoid divide-by-zero
    return ((completedTasks / allTasks) * 100).toFixed(); // 2 decimal places
}

  get progressCount() {
    return this.totalTasks() === 0
      ? 0
      : Number(((100 * this.completedTasks()) / this.totalTasks()).toFixed())
  }


}
