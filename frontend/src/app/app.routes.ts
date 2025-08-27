import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Landing } from './landing/landing';
import { Landing as DLanding } from './date-details/landing/landing';
import { Login } from './login/login';
import { Callback } from './callback/callback';
import { DashboardLanding } from './dashboard-landing/dashboard-landing';
import { Home } from './home/home';
import { Journal } from './journal/journal';
import { Journal as DJournal } from './date-details/journal/journal';
import { Reflection } from './reflection/reflection';
import { Mood } from './mood/mood';
import { Mood as DMood } from './date-details/mood/mood';
import { SelfReflection } from './date-details/self-reflection/self-reflection'; 
import { Tasks } from './date-details/tasks/tasks';
import { Calendar } from './shared/calendar/calendar';
import { Profile } from './profile/profile';
import { Goals } from './goals/goals';
import { DateDetails } from './date-details/date-details';

export const routes: Routes = [
    {
        path: '',
        component: Landing,
        canActivate: [guestGuard]
    },
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'callback',
        component: Callback,
        canActivate: [guestGuard]
    },
    {
        path: '',
        component: DashboardLanding,
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                component: Home
            },
            {
                path: 'journal',
                component: Journal
            },
            {
                path: 'reflection',
                component: Reflection
            },
            {
                path: 'mood',
                component: Mood
            },
            {
                path: 'tasks',
                component: Goals
            },
            {
                path: 'calendar',
                component: Calendar
            },
            {
                path: 'profile',
                component: Profile
            },
            {
                path: 'date-details',
                component: DateDetails,
                children: [
                    {
                        path: ':date',
                       component: DLanding
                    },
                    {
                        path: ":date/mood",
                        component: DMood
                    },
                    {
                        path: ":date/reflection",
                        component: SelfReflection
                    },
                    {
                        path: ":date/journal",
                        component: DJournal
                    },
                    {
                        path: ":date/tasks",
                        component: Tasks
                    }
                ]
            }
        ]
    },
    {
        path: 'privacy-policy',
        loadComponent: () => import('./privacy-policy/privacy-policy').then(c => c.PrivacyPolicy)
    },
    {
        path: 'terms-and-conditions',
        loadComponent: () => import('./tnc/tnc').then(c => c.Tnc)
    }
];
