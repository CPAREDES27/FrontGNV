import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { ListSelectModel } from 'src/app/models/listas/listSelect.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { ListSelectService } from 'src/app/services/list-select.service';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.scss']
})
export class GestionUsuarioComponent implements OnInit {
  userLogeado: AuthorizeModel;
  //listaUsuarios: AllUsuariosModel;
  formFiltro : FormGroup;  
  listPerfil:ListSelectModel;
  
  datos: Array<any>;
  totalPages: Array<number>;

  totalDatos = 0;
  tiposUsuarios = 0;
  numeroDocumento = '';
  page = 1;
  size = 10;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;

  constructor(
    private mantenimientoService:MantenimientoService,
    private authorizesService:AuthorizesService,
    private listSelectService:ListSelectService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.crearForm();
    this.obtenerPerfiles();
    this.obtnerDatosUSerLogeado();
    this.cargarTabla();
  }
  obtenerPerfiles(){
    this.listSelectService.getListSelect(1005).subscribe(resp=>{
      // //////////////////////////console.log(resp);
      this.listPerfil = resp;
    });
  }
  obtnerDatosUSerLogeado(){
    this.userLogeado = this.authorizesService.getUserAuth();
  }

  cargarTabla(){
    this.mantenimientoService.getAllUsuariosPaginadoMant(this.page,this.size,this.tiposUsuarios,this.numeroDocumento).subscribe(response=> {
      //////////////////////////console.log(response.data)

      this.datos = response.data;
      
      this.previousPage = response.meta.hasPreviousPage;
      this.nextPage = response.meta.hasNextPage;
      this.totalPages = new Array(response.meta['totalPages']);
      this.totalDatos = response.meta.totalCount;
      
      //////////////////////////console.log(response)
      //this.listaUsuarios = resp;
    })

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
  
  crearForm(){
    this.formFiltro = this.formBuilder.group({
      tiposUsuarios: [0],
      numeroDocumento: ['']
    })
  }

  setPage(page: number): void {
    this.page = page + 1;
    this.cargarTabla();
  }
  
  filtrar(){
    this.tiposUsuarios = this.formFiltro.get('tiposUsuarios').value;
    this.numeroDocumento = this.formFiltro.get('numeroDocumento').value;
    
    if(this.tiposUsuarios != 0){
      this.size = 10; //Busca sólo 1 registro
      this.page = 1;
      this.barraPaginado = false;
    }else{
      this.size = 10;
      this.barraPaginado = true;
    }

    if(this.numeroDocumento != ''){
      
      //Si es ruc en tipo de usuario se envia el 7 del rol, de lo contrario 0
      if(this.numeroDocumento.length == 11){
        this.tiposUsuarios = 7;
      }

      this.size = 1; //Busca sólo 1 registro
      this.page = 1;
      this.barraPaginado = false;
    }else{
      this.size = 10;
      this.barraPaginado = true;
    }

    this.cargarTabla();
  }

  valNumeros(event: KeyboardEvent): boolean {
    if(event.key === 'Tab') return true;
    if(event.key === 'Backspace') return true;
    else return !!event.key.match(/^[0-9]+$/);
  }


  eliminarRegistro(idRegistro){
   
    Swal.fire({
      text: "¿Seguro que deseas dar de baja a este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00A1DE',
      cancelButtonColor: '#6e7d88',
      confirmButtonText: 'Entendido <i class="fa fa-check pl-2"></i>',
      cancelButtonText: '<i class="fa fa-times pr-2"></i> Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.mantenimientoService.eliminarUsuario(idRegistro,this.userLogeado.id).subscribe(resp=> {
          ////////console.log(resp)

          if (resp.valid) {
            Swal.fire({
              title: "Éxito!",
              text: resp.message,
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: '#00A1DE'
            });
            
            this.cargarTabla();

          } else {
            Swal.fire({
              title: "Error!",
              text: "Se generó un error al dar de baja al usuario, intente nuevamente.",
              icon: "error",
              confirmButtonText: "OK",
              confirmButtonColor: '#00A1DE'
            });
          }
        });
      }
    });
  }
}
