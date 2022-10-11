import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { PostAtencionModel } from 'src/app/models/post-atencion/postAtencion.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { PostAtencionService } from 'src/app/services/postAtencion.service';

@Component({
  selector: 'app-carga-archivos-post-atencion',
  templateUrl: './carga-archivos-post-atencion.component.html',
  styleUrls: ['./carga-archivos-post-atencion.component.scss']
})
export class CargaArchivosPostAtencionComponent implements OnInit {

  columnas: string[]=["idCodigo","numExpediente","nombresApellidos","dni","placa","estadoEvalCrediticia","estado","estadoFinaciamiento","accion"];

  formFiltro : FormGroup; 
  postAtencionModel:PostAtencionModel;

  datos: Array<any>;
  totalPages: Array<number>;
  numeroTotalPaginas:number;

  totalDatos = 0;

  page = 1;
  size = 10;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;
  
  numeroExpediente:string = '';
  datosUsuario:AuthorizeModel;

  constructor(
    private formBuilder: FormBuilder,
    private postAtencionService:PostAtencionService,
    private authorizesService:AuthorizesService
    ) { }

  ngOnInit(): void {
    this.crearForm();
    this.obtenerDatosUSerLogeado();
  }

  crearForm(){
    this.formFiltro = this.formBuilder.group({
      numeroExpediente: [''],
    })
  }


  cargarTabla(){
    //////////////console.log(this.datosUsuario.id);
    this.postAtencionModel={
      numeroRegistros:this.size,
      numeroPagina:this.page,
      numeroExpediente:this.numeroExpediente,
      idProveedor:this.datosUsuario.id
    }

    this.postAtencionService.postListarPostAtencion(this.postAtencionModel).subscribe( 
      response =>{
        this.datos = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.numeroTotalPaginas=response.meta['totalPages'];
        this.totalDatos = response.meta.totalCount;
      }

    )

  }

  
  filtrar(){
    this.numeroExpediente = this.formFiltro.get('numeroExpediente').value;
    if(this.numeroExpediente != ""){
      this.size = 10; //Busca sólo 1 registro
      this.barraPaginado = false;
    }else{
      this.size = 10;
      this.barraPaginado = true;
    }
    
    this.cargarTabla();
  }

  setPage(page: number): void {
    this.page = page + 1;
    this.cargarTabla();
  }

  
  back(): void {
    if(this.previousPage != false){
      this.page--;
      if (this.page==0) {
        this.page++;
      }else{
        this.cargarTabla();
      }
      
    }
  }

  next(): void {
    if(this.nextPage != false){
      this.page++;

      if (this.page>this.numeroTotalPaginas) {
        this.page--;
      }else{
        this.cargarTabla();
      }


    }
  }

  verDetallePostAtencion(idEvCliente:number,formulario:string){
    // //////////////////////////console.log(idPreevaluacion);
    this.authorizesService.redirectDetallePostAtencion(idEvCliente,formulario,0);
  }


  obtenerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();

    this.cargarTabla();
  }

}
