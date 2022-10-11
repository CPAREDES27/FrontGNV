import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';
import { PortalGnvContainerComponent } from 'src/app/components/portal-gnv-container/portal-gnv-container.component';
import { PortalGnvHomeComponent } from 'src/app/components/portal-gnv-home/portal-gnv-home.component';  
import { PreevaluacionComponent } from 'src/app/components/evaluacion/preevaluacion/preevaluacion.component';
import { RegistroInformacionComponent } from 'src/app/components/financiamiento/registro-informacion/registro-informacion.component';
import { SolicitudFinanciamientoComponent } from 'src/app/components/financiamiento/solicitud-financiamiento/solicitud-financiamiento.component';
import { GestionUsuarioComponent } from 'src/app/components/mantenimiento/gestion-usuario/gestion-usuario.component';
import { ValidacionComponent } from 'src/app/components/operaciones/validacion/validacion.component';
import { EvaluacionClienteComponent } from 'src/app/components/evaluacion/evaluacion-cliente/evaluacion-cliente.component';
import { EvaluacionCrediticiaComponent } from 'src/app/components/evaluacion/evaluacion-crediticia/evaluacion-crediticia.component';
import { CargaArchivosPostAtencionComponent } from 'src/app/components/consulta-descarga/carga-archivos-post-atencion/carga-archivos-post-atencion.component';
import { ReglasKnockoutComponent } from '../../components/evaluacion/reglas-knockout/reglas-knockout.component';
import { RegistroSolicitudFinanciamientoComponent } from '../../components/financiamiento/registro-solicitud-financiamiento/registro-solicitud-financiamiento.component';
import { RespondeEncuestaComponent } from '../../components/financiamiento/responde-encuesta/responde-encuesta.component';
import { FormularioFinanciamientoComponent } from 'src/app/components/financiamiento/formulario-financiamiento/formulario-financiamiento.component';
import { DetEvaCredComponent } from 'src/app/components/evaluacion/det-eva-cred/det-eva-cred.component';
import { DocAdjEvaCredComponent } from 'src/app/components/evaluacion/doc-adj-eva-cred/doc-adj-eva-cred.component';
import { RegistrarUsuarioComponent } from 'src/app/components/mantenimiento/registrar-usuario/registrar-usuario.component';
import { GestionEncuestaComponent } from 'src/app/components/mantenimiento/gestion-encuesta/gestion-encuesta.component';
import { RegistrarEncuestaComponent } from 'src/app/components/mantenimiento/registrar-encuesta/registrar-encuesta.component';
import { GestionInformacionComponent } from 'src/app/components/financiamiento/gestion-informacion/gestion-informacion.component';
import { DetalleExpedienteComponent } from 'src/app/components/consulta-descarga/detalle-expediente/detalle-expediente.component';
import { DetalleDocumentoComponent } from 'src/app/components/operaciones/detalle-documento/detalle-documento.component';
import { DetalleEvaClienteComponent } from 'src/app/components/evaluacion/detalle-eva-cliente/detalle-eva-cliente.component';
import { ConsultaDatosComponent } from 'src/app/components/consulta-descarga/consulta-datos/consulta-datos.component';
import { DetalleConsultaDatosComponent } from 'src/app/components/consulta-descarga/detalle-consulta-datos/detalle-consulta-datos.component';
import { ListarProductosComponent } from 'src/app/components/administracion/productos/listar-productos/listar-productos.component';
import { RegistrarProductoComponent } from 'src/app/components/administracion/productos/registrar-producto/registrar-producto.component';
import { PlantillaCorreoComponent } from 'src/app/external-components/plantilla-correo/plantilla-correo.component';
import { PasswordRecuperarComponent } from 'src/app/external-components/password-recuperar/password-recuperar.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { ArchivosSAPComponent } from 'src/app/components/operaciones/archivos-sap/archivos-sap.component';

const routes: Routes = [
    {
      //path: '', component: PortalGnvContainerComponent, 
      path: '', component: PortalGnvContainerComponent, canActivate:[AuthenticationGuard],
      children: [
        //HomeGnv
        { path: 'home', component: PortalGnvHomeComponent }, 
        //Financiamiento
        { path: 'registro-solicitud-financiamiento', component: RegistroSolicitudFinanciamientoComponent }, 
        { path: 'formulario-financiamiento', component: FormularioFinanciamientoComponent}, 
        
        { path: 'gestion-informacion', component: GestionInformacionComponent },
        { path: 'registro-informacion/:idUsuario/:idProducto/:idPreevaluacion', component: RegistroInformacionComponent },

        { path: 'solicitud-financiamiento', component: SolicitudFinanciamientoComponent }, 
        //{ path: 'responde-encuesta', component: RespondeEncuestaComponent }, 
        //Mantenimiento
        { path: 'gestion-usuario', component: GestionUsuarioComponent }, 
        { path: 'registrar-usuario', component: RegistrarUsuarioComponent }, 
        { path: 'editar-usuario/:id', component: RegistrarUsuarioComponent }, 
        { path: 'gestion-encuesta', component: GestionEncuestaComponent }, 
        { path: 'registrar-encuesta', component: RegistrarEncuestaComponent }, 
        { path: 'editar-encuesta/:id', component: RegistrarEncuestaComponent }, 
        //Operaciones
        { path: 'archivos-sap', component: ArchivosSAPComponent }, 
        { path: 'validacion-documentos', component: ValidacionComponent }, 
        { path: 'detalle-documento/:id', component: DetalleDocumentoComponent }, 

        //Consulta-Descarga post atención
        { path: 'carga-post-atencion', component: CargaArchivosPostAtencionComponent }, 
        { path: 'detalle-expediente/:id', component: DetalleExpedienteComponent }, 
        { path: 'consulta-datos', component: ConsultaDatosComponent }, 
        { path: 'detalle-consulta-datos/:id', component: DetalleConsultaDatosComponent }, 
        //Evaluacion
        { path: 'evaluacion-cliente', component: EvaluacionClienteComponent },
        { path: 'detalle-eva-cliente/:id', component: DetalleEvaClienteComponent },
        { path: 'evaluacion-crediticia', component: EvaluacionCrediticiaComponent },
        { path: 'det-eva-cred/:id/:tipoDocumento/:documento', component: DetEvaCredComponent },
        { path: 'doc-adj-eva-cred/:id/:idPreevaluacion', component: DocAdjEvaCredComponent },
        { path: 'preevaluacion', component: PreevaluacionComponent },
        { path: 'reglas-Knockout/:id', component: ReglasKnockoutComponent },
        
        //Administración
        { path: 'productos', component: ListarProductosComponent },
        { path: 'registrar-producto', component: RegistrarProductoComponent },
        { path: 'editar-producto/:id', component: RegistrarProductoComponent },

        //Correo
        { path: 'plantilla-correo', component: PlantillaCorreoComponent },

        //Recuperar Contraseña
        { path: 'password-recuperar', component: PasswordRecuperarComponent },

        //Recuperar Contraseña
        { path: 'dashboard', component: DashboardComponent },
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PortalGnvRoutingModule { }
