import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// lazy-load module
// for new page use the cli-> ionic generate page name (https://ionicframework.com/docs/cli/commands/generate)
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'opt-in',
    loadChildren: () =>
      import('./opt-in/opt-in.module').then((m) => m.OptInPageModule),
  },
  {
    path: 'how-to',
    loadChildren: () =>
      import('./how-to/how-to.module').then((m) => m.HowToPageModule),
  },
  // http://localhost:8100/main/tabs/tab1
  {
    path: 'main',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
