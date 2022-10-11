import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/core/models/material.module'; 

import { ExternalComponentsRoutingModule } from './external-components-routing.module';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
 
import { EmpresaRegisterComponent } from './empresa-register/empresa-register.component';
import { PreevaluationRequestComponent } from './preevaluation-request/preevaluation-request.component';
import { PreevaluationDialogComponent } from './dialog-module/preevaluation-dialog/preevaluation-dialog.component';
import { ErrorDialogComponent } from './dialog-module/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from './dialog-module/success-dialog/success-dialog.component';
import { NgxMaskModule } from 'ngx-mask';
import { HomePageComponent } from './home/home-page/home-page.component';
import { PlantillaCorreoComponent } from './plantilla-correo/plantilla-correo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PasswordRecuperarComponent } from './password-recuperar/password-recuperar.component';
import {OnlyNumberExternalDirective} from 'src/app/external-components/only-number-external.directive'
import { CarouselModule } from 'ngx-owl-carousel-o';
import {VentanaService} from 'src/app/services/ventana.service'
import { WINDOW_PROVIDERS } from '../services/windows.service';

@NgModule({
    declarations: [
        LoginComponent,
        UserRegisterComponent,
        EmpresaRegisterComponent,
        PreevaluationRequestComponent,
        PreevaluationDialogComponent, 
        ErrorDialogComponent,
        SuccessDialogComponent,
        HomePageComponent,
        PlantillaCorreoComponent,
        PasswordRecuperarComponent,
        OnlyNumberExternalDirective
    ],
    imports: [ 
        ExternalComponentsRoutingModule,
        MaterialModule,
        NgxMaskModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        CarouselModule,
    ],
    providers:[VentanaService,WINDOW_PROVIDERS]
})

export class ExternalComponentsModule { }