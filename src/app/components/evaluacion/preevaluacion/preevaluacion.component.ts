import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { ListPreevaluacionModel } from 'src/app/models/preevaluacion/list-preevaluacion/list-preevaluacion.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { ReglasKnockoutService } from 'src/app/services/reglas-knockout.service';
import { VentanaService } from 'src/app/services/ventana.service';
import { WINDOW } from 'src/app/services/windows.service';
import { LineaTiempoFormularioComponent } from '../../linea-tiempo/linea-tiempo-formulario/linea-tiempo-formulario.component';

@Component({
  selector: 'app-preevaluacion',
  templateUrl: './preevaluacion.component.html',
  styleUrls: ['./preevaluacion.component.scss']
})
export class PreevaluacionComponent implements OnInit {
  //formPreevaluacionClient: FormGroup;
  // preevaluacionClient: ListPreevaluacionModel[] = [];
  // myDataSourceGnv = new MatTableDataSource<ListPreevaluacionModel>();
  // idPrevaluation: number;
  // cols: string[]=["idCodigo","nombreClient","apeClient","numeroDocumentoClient","numeroPlacaClient", "estadoFinanciamientoClient", "accionClient"];
  formFiltro : FormGroup;  

  datos: Array<any>;
  totalPages: Array<number>;

  totalDatos = 0;
  inputConsulta = '';
  page = 1;
  size = 10;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;

  idAsesor:number=0;
  datosUsuario:AuthorizeModel;

  constructor(
    private reglasKnockoutService: ReglasKnockoutService,
    private authorizesService: AuthorizesService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    //Abrir pestaña y cerrar esa pestaña
    @Inject(WINDOW) public window: Window) { }

  ngOnInit(): void {
    
    //this.getListPreevaluacionClient();
    this.obtnerDatosUSerLogeado();
    this.idAsesor=(this.datosUsuario.rol==="1" || this.datosUsuario.rol==="8")?0:this.datosUsuario.id;
    // //////////////////////////console.log("ID ASESOR: "+this.idAsesor)
    this.cargarTabla();
    this.formularioDatos();
    this.crearForm();
    
    
  }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
  }
  // getListPreevaluacionClient(): void{ 
  //   this.reglasKnockoutService.getListPreevaluacionClient().subscribe(response => {
  //     this.preevaluacionClient=response;
  //     this.myDataSourceGnv = new MatTableDataSource<ListPreevaluacionModel>(this.preevaluacionClient);
  //   });

  // }

  verDetallePreevaluacion(idPreevaluacion:number){
    // //////////////////////////console.log(idPreevaluacion);
    this.authorizesService.redirectReglasKnockout(idPreevaluacion);
  }

  //Implementación de paginación

  cargarTabla(){
    // //////////////////////////console.log(this.page);

    this.reglasKnockoutService.getPreevaluationPagination(this.page,this.size,this.inputConsulta,this.idAsesor).subscribe( 
      response =>{
        this.datos = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.totalDatos = response.meta.totalCount;

        //  //////////////////////////console.log("DATA: "+JSON.stringify(response.data))
      }
    )
    
  }

  back(): void {
    if(this.previousPage != false){
      this.page--;
      this.cargarTabla();
    }
  }

  next(): void {
    if(this.nextPage != false){
      this.page++;
      this.cargarTabla();
    }
  }

  setPage(page: number): void {
    this.page = page + 1;
    this.cargarTabla();
  }
  
  //Filtro
  formularioDatos(){
    this.formFiltro = new FormGroup({
      inputFilter: new FormControl(),
    });
  }

  crearForm(){
    this.formFiltro = this.formBuilder.group({
      inputFilter: ['']
    })
  }

  filtrar(){
    this.inputConsulta = this.formFiltro.get('inputFilter').value;
    if(this.inputConsulta != ""){
      this.size = 10; //Busca sólo 1 registro
      this.barraPaginado = false;
    }else{
      this.size = 10;
      this.barraPaginado = true;
    }
    
    this.cargarTabla();
  }


  SolicitudPreevaluacion(): void{
 /*    // this.authorizesService.redirectSolicitudPreevaluacion();
    var url=document.location.origin+"/solicitudReferido/"+this.datosUsuario.id
    //var win = window.open(url, '_blank');
    this.ventana_secundaria=window.open(url, '_blank');
    // Cambiar el foco al nuevo tab (punto opcional)
    this.ventana_secundaria.focus();
 */

    var url=document.location.origin+"/solicitudReferido/"+this.datosUsuario.id
    this.window.open(url, "_blank")
    this.window.focus();
  }

  // refrescarFormulario(){
  //   this.cargarTabla();
  //   this.refrescar=false
  // }

  // verDetallePreevaluacion(dataClient: ListPreevaluacionModel){
  //   //////////////////////////console.log(dataClient);
  //   debugger
  //   this.reglasKnockoutService.getPendingPrevaluationClient(dataClient.idPreevaluacion).subscribe(response => {
  //     this.authorizesService.redirectReglasKnockout();
  //   });
  // }

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
