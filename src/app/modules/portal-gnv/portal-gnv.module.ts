import { NgModule } from '@angular/core';  
import { PortalGnvRoutingModule } from './portal-gnv.routing.module';
import { PortalGnvContainerComponent } from 'src/app/components/portal-gnv-container/portal-gnv-container.component';
import { PortalGnvFooterComponent } from 'src/app/components/portal-gnv-footer/portal-gnv-footer.component';
import { PortalGnvHeaderComponent } from 'src/app/components/portal-gnv-header/portal-gnv-header.component';
import { PortalGnvHomeComponent } from 'src/app/components/portal-gnv-home/portal-gnv-home.component';  
import { PortalGnvMenuComponent } from 'src/app/components/portal-gnv-menu/portal-gnv-menu.component'; 
import { MaterialModule } from 'src/app/core/models/material.module'; 

import { PreevaluacionComponent } from 'src/app/components/evaluacion/preevaluacion/preevaluacion.component';
import { RegistroInformacionComponent } from 'src/app/components/financiamiento/registro-informacion/registro-informacion.component';
import { SolicitudFinanciamientoComponent } from 'src/app/components/financiamiento/solicitud-financiamiento/solicitud-financiamiento.component';
import { GestionUsuarioComponent } from 'src/app/components/mantenimiento/gestion-usuario/gestion-usuario.component';
import { ValidacionComponent } from 'src/app/components/operaciones/validacion/validacion.component';
import { EvaluacionClienteComponent } from 'src/app/components/evaluacion/evaluacion-cliente/evaluacion-cliente.component';
import { EvaluacionCrediticiaComponent } from 'src/app/components/evaluacion/evaluacion-crediticia/evaluacion-crediticia.component';
import { CargaArchivosPostAtencionComponent } from 'src/app/components/consulta-descarga/carga-archivos-post-atencion/carga-archivos-post-atencion.component';
import {DashboardComponent} from 'src/app/components/dashboard/dashboard.component'
import { CorreoModel } from 'src/app/models/correo/correo.model';
import { DatePipe } from '@angular/common';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import {VentanaService} from 'src/app/services/ventana.service'
import { WINDOW, WINDOW_PROVIDERS } from 'src/app/services/windows.service';
import { ArchivosSAPComponent } from 'src/app/components/operaciones/archivos-sap/archivos-sap.component';




@NgModule({
    declarations: [
      PortalGnvContainerComponent,
      PortalGnvFooterComponent,
      PortalGnvHeaderComponent,
      PortalGnvHomeComponent,
      PortalGnvMenuComponent,
      PreevaluacionComponent,
      RegistroInformacionComponent,
      SolicitudFinanciamientoComponent,
      GestionUsuarioComponent,
      ValidacionComponent,
      ArchivosSAPComponent,
      EvaluacionClienteComponent,
      EvaluacionCrediticiaComponent,
      CargaArchivosPostAtencionComponent,
      DashboardComponent
    ],
    imports: [ 
      PortalGnvRoutingModule,  
      MaterialModule,
      NgxChartsModule,
    ],
    providers:[CorreoModel,DatePipe,VentanaService,WINDOW_PROVIDERS]
  })

  export class PortalGnvModule { }