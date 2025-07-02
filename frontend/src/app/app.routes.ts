import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home', 
        loadComponent: () => import('./home/home').then(c => c.Home)
    },
    {
        path: 'journal',
        loadComponent: () => import('./journal/journal').then(c => c.Journal)
    },
    {
        path: 'reflection',
        loadComponent: () => import('./reflection/reflection').then(c => c.Reflection)
    },
    {
        path: 'mood',
        loadComponent: () => import('./mood/mood').then(c => c.Mood)
    },
    {
        path: 'calendar',
        loadComponent: () => import('./calendar-page/calendar-page').then(c =>c.CalendarPage)
    }
];
