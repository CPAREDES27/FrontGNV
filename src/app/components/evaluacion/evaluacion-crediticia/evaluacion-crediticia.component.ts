import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { EvaluacionCrediticiaModel } from 'src/app/models/evaluacion-crediticia/evaluacion-crediticia-model';
import { MaestroModel } from 'src/app/models/maestro/maestro.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { EstadosService } from 'src/app/services/estados.service';
import { EvaluacionCrediticiaService } from 'src/app/services/evaluacion-crediticia.service';
import { MaestroService } from 'src/app/services/maestro.service';
import Swal from 'sweetalert2';
import { LineaTiempoFormularioComponent } from '../../linea-tiempo/linea-tiempo-formulario/linea-tiempo-formulario.component';


@Component({
  selector: 'app-evaluacion-crediticia',
  templateUrl: './evaluacion-crediticia.component.html',
  styleUrls: ['./evaluacion-crediticia.component.scss']
})
export class EvaluacionCrediticiaComponent implements OnInit {

  columnas: string[]=["idCodigo","numExpediente","nombresApellidos","dni","placa","estadoRK","estado","accion"];
  constructor(
    private estadoService:EstadosService,
    private evaluacionCrediticiaService:EvaluacionCrediticiaService,
    private formBuilder: FormBuilder,
    private authorizesService:AuthorizesService,
    private maestroService:MaestroService,
    private dialog: MatDialog,
  ) { }

  listaEstados:EstadoModel;

  listaEvaluacionCrediticia:EvaluacionCrediticiaModel;

  datos: Array<any>;
  totalPages: Array<number>;
  numeroTotalPaginas:number;

  totalDatos = 0;

  numeroExpediente:string = '';
  estadoFinanciamiento:number=0;

  maestro:MaestroModel;

  page = 1;
  size = 10;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;

  formFiltro : FormGroup;  

  montoMinimoMaximo:number[]=[0,0]

  ngOnInit(): void {
    this.crearForm()
    this.listarEstados();
    this.cargarTabla();
    this.consultarMontoMinMax();
  }


  crearForm(){
    this.formFiltro = this.formBuilder.group({
      numeroExpediente: [''],
      estadoFinanciamiento: ['']
    })
  }

  listarEstados(){
    this.estadoService.getListEstados("EvaluacionCliente").subscribe(response => {
      this.listaEstados=response;
    })
  }

  cargarTabla(){
    // //////////////////////////console.log(this.page);
    this.listaEvaluacionCrediticia={
      numeroRegistros:this.size,
      numeroPagina:this.page,
      numeroExpediente:this.numeroExpediente,
      estadoFinanciamiento:this.estadoFinanciamiento
    }

    //////////////////////console.log(JSON.stringify(this.listaEvaluacionCrediticia))
    this.evaluacionCrediticiaService.postListarEvaluacionCrediticia(this.listaEvaluacionCrediticia).subscribe( 

      
      response =>{
        this.datos = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.numeroTotalPaginas=response.meta['totalPages'];
        this.totalDatos = response.meta.totalCount;
        // ////////////////////////console.log(response.meta['totalPages'])
        // ////////////////////////console.log(JSON.stringify(response))
        //////////////////////////console.log(JSON.stringify(this.datos))
        //  //////////////////////////console.log("DATA: "+JSON.stringify(response.data))
      }

    )

  }

  filtrar(){
    this.numeroExpediente = this.formFiltro.get('numeroExpediente').value;
    this.estadoFinanciamiento = this.formFiltro.get('estadoFinanciamiento').value;
    if(this.numeroExpediente != ""){
      this.size = 10; //Busca sólo 1 registro
      this.barraPaginado = false;
    }else if (this.estadoFinanciamiento!= 0) {
      this.size = 10; //Busca sólo 1 registro
      this.barraPaginado = false;
    }else{
      this.size = 10;
      this.barraPaginado = true;
    }

    if (!Number(this.estadoFinanciamiento)) {
      this.estadoFinanciamiento=0
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

 async verDetalleEvaluacionCreditica(idEvCliente:number,tipoDocumento:string,documento:string,formulario:string){
    console.log(documento);
    console.log(tipoDocumento);
    var estado=false;
    // //////////////////////////console.log(idPreevaluacion);
    await this.evaluacionCrediticiaService.getDetalleEvaluacionCrediticia(idEvCliente,tipoDocumento,documento).subscribe(data => {
      if(data.message==="No se pudo listar la informacion."){
        Swal.fire({
          icon: 'info',
          iconColor:'orange',
          html:
            'El Cliente no ha llenado las 40 preguntas',
          confirmButtonColor:'#00A1DE'
        })
        estado=true;
        this.authorizesService.redirectListaEvaluacion();
        return true;
      }else{
        this.authorizesService.redirectDetalleEvaluacionCreditica(idEvCliente,tipoDocumento,documento,formulario,0);
      }
    
    });
   
    
  }


  consultarMontoMinMax(){

    this.maestro=({
      keyUser:"IMPORTE_FINANCIAMIENTO"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      var montos=resp.valor.split(',')
      this.montoMinimoMaximo[0]=parseInt(montos[0])
      this.montoMinimoMaximo[1]=parseInt(montos[1])
    })
  }

  abrirLineaTiempo(clave:string,id:number){
    //const dialogRef =  this.dialog.open(PendienteFormularioComponent, {data: {name: this.name}, disableClose: true});
    const dialogRef =  this.dialog.open(LineaTiempoFormularioComponent, {data: {clave: clave,id:id},disableClose: true,width:'100%',height:'auto'});
    dialogRef.afterClosed().subscribe((submit) => {
     if (submit) {
       //this.food = submit;
       //console.log("DATA MOSTRAR: "+JSON.stringify(submit))

     } else {
       console.log("Nothing")
       //this.food = 'Nothing...';
     }
   })
  }
  
}
