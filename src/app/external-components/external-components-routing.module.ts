import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { EmpresaRegisterComponent } from './empresa-register/empresa-register.component';
import { PreevaluationRequestComponent } from './preevaluation-request/preevaluation-request.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { PlantillaCorreoComponent } from './plantilla-correo/plantilla-correo.component';
import { PasswordRecuperarComponent } from './password-recuperar/password-recuperar.component';
import { RespondeEncuestaComponent } from '../components/financiamiento/responde-encuesta/responde-encuesta.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "home", component: HomePageComponent },
  { path: "login", component: LoginComponent },
  { path: "registrar-usuario", component: UserRegisterComponent },
  { path: "registrar-empresa", component: EmpresaRegisterComponent },
  { path: "plantilla-correo", component: PlantillaCorreoComponent },
  { path: "solicitud-preevaluacion", component: PreevaluationRequestComponent },
  { path: "solicitudPreevaluacion/:idprod", component: PreevaluationRequestComponent },
  { path: "solicitudReferido/:idAsesor", component: PreevaluationRequestComponent },
  { path: "password-recuperar", component: PasswordRecuperarComponent },
  { path: 'responde-encuesta', component: RespondeEncuestaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalComponentsRoutingModule { }