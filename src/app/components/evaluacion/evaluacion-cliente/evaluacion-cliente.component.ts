import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { EvaluacionClientePaginacionModel } from 'src/app/models/evaluacion-cliente/evaluacion-cliente-pag.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { EstadosService } from 'src/app/services/estados.service';
import { EvaluacionClienteService } from 'src/app/services/evaluacion-cliente.service';
import { LineaTiempoFormularioComponent } from '../../linea-tiempo/linea-tiempo-formulario/linea-tiempo-formulario.component';

@Component({
  selector: 'app-evaluacion-cliente',
  templateUrl: './evaluacion-cliente.component.html',
  styleUrls: ['./evaluacion-cliente.component.scss']
})
export class EvaluacionClienteComponent implements OnInit {

  columnas: string[]=["idCodigo","numExpediente","nombresApellidos","dni","placa","estadoRK","estado","accion"];
  
  constructor(
    private estadoService:EstadosService,
    private evaluacionClienteService:EvaluacionClienteService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private authorizesService:AuthorizesService
  ) { }
  // myDataTable = [
  //   {
  //     id: "1",
  //     numExpediente: "98387489237490",
  //     nombApellidos: "Percy Antony Grimaldo Vidalon",
  //     dni: "74545450",
  //     placa: "XGH 5642",
  //     estado: 3
  //   },
  //   {
  //     id: "2",
  //     numExpediente: "98387489237491",
  //     nombApellidos: "Carlos Lopez Chavez",
  //     dni: "40100012",
  //     placa: "XDT 456",
  //     estado: 4
  //   },
  //   {
  //     id: "3",
  //     numExpediente: "98387489237000",
  //     nombApellidos: "Lourdes Pesantes Garcia",
  //     dni: "80802020",
  //     placa: "MGT 452",
  //     estado: 5
  //   }
  // ]

  
  listaEstados:EstadoModel;

  listaEvaluacionCliente:EvaluacionClientePaginacionModel;

  datos: Array<any>;
  totalPages: Array<number>;
  numeroTotalPaginas:number;

  totalDatos = 0;

  numeroExpediente:string = '';
  estadoFinanciamiento:number=0;



  page = 1;
  size = 10;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;

  formFiltro : FormGroup;

  ngOnInit(): void {
    this.crearForm()
    this.listarEstados();
    this.cargarTabla();
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
    this.listaEvaluacionCliente={
      numeroRegistros:this.size,
      numeroPagina:this.page,
      numeroExpediente:this.numeroExpediente,
      idEstado:this.estadoFinanciamiento
    }

    ////////////////////////console.log(JSON.stringify(this.listaEvaluacionCliente))

    this.evaluacionClienteService.postListarEvaluacionCliente(this.listaEvaluacionCliente).subscribe( 
      response =>{
        this.datos = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.numeroTotalPaginas=response.meta['totalPages'];
        this.totalDatos = response.meta.totalCount;
        // ////////////////////////console.log(response.meta['totalPages'])
        // ////////////////////////console.log(JSON.stringify(response))
        // ////////////////////////console.log(JSON.stringify(this.datos))  
        //  //////////////////////////console.log("DATA: "+JSON.stringify(response.data))
      }

    )

  }

  filtrar(){
    this.numeroExpediente = this.formFiltro.get('numeroExpediente').value;
    this.estadoFinanciamiento = this.formFiltro.get('estadoFinanciamiento').value;
    ////////////////////////console.log("ESTADO FINAN: "+this.estadoFinanciamiento)
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

  verDetalleEvaluacionCliente(idEvCliente:number){
    // //////////////////////////console.log(idPreevaluacion);
    this.authorizesService.redirectDetalleEvaluacionCliente(idEvCliente);
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
