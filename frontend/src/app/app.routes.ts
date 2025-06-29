import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home', 
        loadComponent: () => import('./home/home').then(c => c.Home)
    }
];
