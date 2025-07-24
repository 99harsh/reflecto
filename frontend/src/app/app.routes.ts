import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./landing/landing').then(c => c.Landing)
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(c => c.Login)
    },
    {
        path: '',
        loadComponent: () => import('./dashboard-landing/dashboard-landing').then(c => c.DashboardLanding),
        children: [
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
                path: 'goals',
                loadComponent: () => import('./goals/goals').then(c => c.Goals)
            },
            {
                path: 'calendar',
                loadComponent: () => import('./calendar-page/calendar-page').then(c => c.CalendarPage)
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile').then(c => c.Profile)
            }
        ]
    }
];
