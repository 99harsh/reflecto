import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
   {
    path: 'date-details/:date',
    renderMode: RenderMode.Server
  },
   {
    path: 'date-details/:date/mood',
    renderMode: RenderMode.Server
  },
     {
    path: 'date-details/:date/journal',
    renderMode: RenderMode.Server
  },
  {
    path: 'date-details/:date/reflection',
    renderMode: RenderMode.Server
  },
  {
    path: 'date-details/:date/tasks',
    renderMode: RenderMode.Server
  }
];
