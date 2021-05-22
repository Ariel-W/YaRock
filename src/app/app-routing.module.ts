import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// lazy-load module
// for new page use the cli-> ionic generate page name (https://ionicframework.com/docs/cli/commands/generate)
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  // http://localhost:8100/main/tabs/tab1
  {
    path: 'main',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
