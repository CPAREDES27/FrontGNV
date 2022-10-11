import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guards/authentication.guard';


const routes: Routes = [ 
  {
    path: "",
    loadChildren:() => import("./external-components/external-components.module")
      .then(m => m.ExternalComponentsModule)
  },
  {
    // path: "gnv",
    path: "gnv", canActivate:[AuthenticationGuard],
    loadChildren:() => import("./modules/portal-gnv/portal-gnv.module")
      .then(m => m.PortalGnvModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
