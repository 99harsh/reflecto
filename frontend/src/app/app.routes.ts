import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./landing/landing').then(c => c.Landing),
        canActivate: [guestGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(c => c.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'callback',
        loadComponent: () => import('./callback/callback').then(c => c.Callback),
        canActivate: [guestGuard]
    },
    {
        path: '',
        loadComponent: () => import('./dashboard-landing/dashboard-landing').then(c => c.DashboardLanding),
        canActivate: [authGuard],
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
                path: 'tasks',
                loadComponent: () => import('./goals/goals').then(c => c.Goals)
            },
            {
                path: 'calendar',
                loadComponent: () => import('./calendar-page/calendar-page').then(c => c.CalendarPage)
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile').then(c => c.Profile)
            },
            {
                path: 'date-details',
                loadComponent: () => import('./date-details/date-details').then(c => c.DateDetails),
                children: [
                    {
                        path: ':date',
                        loadComponent: () => import('./date-details/landing/landing').then(c => c.Landing)
                    },
                    {
                        path: ":date/mood",
                        loadComponent: () => import('./date-details/mood/mood').then(c => c.Mood)
                    },
                    {
                        path: ":date/reflection",
                        loadComponent: () => import('./date-details/self-reflection/self-reflection').then(c => c.SelfReflection)
                    },
                    {
                        path: ":date/journal",
                        loadComponent: () => import('./date-details/journal/journal').then(c => c.Journal)
                    },
                    {
                        path: ":date/tasks",
                        loadComponent: () => import('./date-details/tasks/tasks').then(c => c.Tasks)
                    }
                ]
            },
        ]
    }
];
