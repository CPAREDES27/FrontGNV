import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { ReglasKnockoutService } from 'src/app/services/reglas-knockout.service';

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit {

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
  ) { }

  ngOnInit(): void {
    this.obtnerDatosUSerLogeado();
    this.idAsesor=(this.datosUsuario.rol==="1" || this.datosUsuario.rol==="8")?0:this.datosUsuario.id;
    this.cargarTabla();
    this.formularioDatos();
    this.crearForm();
  }
  
  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
  }

  cargarTabla(){
    this.reglasKnockoutService.getPreevaluationPagination(this.page,this.size,this.inputConsulta,this.idAsesor).subscribe( 
      response =>{
        this.datos = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.totalDatos = response.meta.totalCount;
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

  verDetalleDocumento(idPreevaluacion:number){
    // //////////////////////////console.log(idPreevaluacion);
    this.authorizesService.redirectDetalleDocumentoValidacion(idPreevaluacion);
  }




}
