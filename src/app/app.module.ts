import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/core/models/material.module'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { PreloaderComponent } from './components/preloader/preloader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgHttpLoaderModule } from 'ng-http-loader';

import { JwtInterceptorService } from './interceptors/jwt-interceptor.service';
import { AuthInterceptorService } from './interceptors/auth.interceptor.service';
import { ReglasKnockoutComponent } from './components/evaluacion/reglas-knockout/reglas-knockout.component';
import { RegistroSolicitudFinanciamientoComponent } from './components/financiamiento/registro-solicitud-financiamiento/registro-solicitud-financiamiento.component';
import { RespondeEncuestaComponent } from './components/financiamiento/responde-encuesta/responde-encuesta.component';
import { FormularioFinanciamientoComponent } from './components/financiamiento/formulario-financiamiento/formulario-financiamiento.component';
import { ModalComponent } from './components/financiamiento/modal/modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DetEvaCredComponent } from './components/evaluacion/det-eva-cred/det-eva-cred.component';
import { DocAdjEvaCredComponent } from './components/evaluacion/doc-adj-eva-cred/doc-adj-eva-cred.component';
import { ModalPdfComponent } from './components/evaluacion/modal-pdf/modal-pdf.component';
import { RegistrarUsuarioComponent } from './components/mantenimiento/registrar-usuario/registrar-usuario.component';
import { NgxMaskModule } from 'ngx-mask';
import { GestionEncuestaComponent } from './components/mantenimiento/gestion-encuesta/gestion-encuesta.component';
import { RegistrarEncuestaComponent } from './components/mantenimiento/registrar-encuesta/registrar-encuesta.component';
import { GestionInformacionComponent } from './components/financiamiento/gestion-informacion/gestion-informacion.component';
import { DetalleExpedienteComponent } from './components/consulta-descarga/detalle-expediente/detalle-expediente.component';
import { DetalleDocumentoComponent } from './components/operaciones/detalle-documento/detalle-documento.component';
import { DetalleEvaClienteComponent } from './components/evaluacion/detalle-eva-cliente/detalle-eva-cliente.component';
import { ConsultaDatosComponent } from './components/consulta-descarga/consulta-datos/consulta-datos.component';
import { DetalleConsultaDatosComponent } from './components/consulta-descarga/detalle-consulta-datos/detalle-consulta-datos.component';
import { ListarProductosComponent } from './components/administracion/productos/listar-productos/listar-productos.component';
import { RegistrarProductoComponent } from './components/administracion/productos/registrar-producto/registrar-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {OnlyNumberDirective} from 'src/app/only-number.directive'
import { ModalAdjuntarComponent } from './components/evaluacion/reglas-knockout/modal-adjuntar/modal-adjuntar.component';
import { ModalAgregarAsesorComponent } from './components/evaluacion/reglas-knockout/modal-agregar-asesor/modal-agregar-asesor.component';
import { ModalPrevPdfComponent } from './components/evaluacion/modal-prev-pdf/modal-prev-pdf.component';
import { PendienteFormularioComponent } from './components/financiamiento/formulario-financiamiento/pendiente-formulario/pendiente-formulario.component';
import { LineaTiempoFormularioComponent } from './components/linea-tiempo/linea-tiempo-formulario/linea-tiempo-formulario.component';
import { DetalleFinanciamientoComponent } from './components/financiamiento/formulario-financiamiento/detalle-financiamiento/detalle-financiamiento.component';



//import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AppComponent, 
    PreloaderComponent, 
    ReglasKnockoutComponent, 
    RegistroSolicitudFinanciamientoComponent, 
    RespondeEncuestaComponent, 
    FormularioFinanciamientoComponent, 
    ModalComponent, 
    DetEvaCredComponent, 
    DocAdjEvaCredComponent, 
    ModalPdfComponent, 
    ModalPrevPdfComponent,
    ModalAdjuntarComponent,
    ModalAgregarAsesorComponent,
    RegistrarUsuarioComponent,
    GestionEncuestaComponent, 
    RegistrarEncuestaComponent,
    GestionInformacionComponent,
    DetalleExpedienteComponent,
    DetalleDocumentoComponent,
    DetalleEvaClienteComponent,
    ConsultaDatosComponent,
    DetalleConsultaDatosComponent,
    ListarProductosComponent,
    RegistrarProductoComponent,
    OnlyNumberDirective,
    PendienteFormularioComponent,
    LineaTiempoFormularioComponent,
    DetalleFinanciamientoComponent,
    
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule, 
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    NgxMaskModule.forRoot(),
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
