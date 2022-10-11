import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.scss']
})
export class ListarProductosComponent implements OnInit {
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

  datosUsuario:AuthorizeModel;
  idUsuario:number=0

  constructor(
    private productService:ProductService,
    private formBuilder: FormBuilder,
    private authorizesService:AuthorizesService,
    ) { }

  ngOnInit(): void {

    
    this.formularioDatos();
    this.crearForm();
    this.obtnerDatosUSerLogeado();
  }

  

  obtenerProductos(){
    this.productService.getListProductosPaginacion(this.page,this.size,this.inputConsulta.toUpperCase(),this.idUsuario).subscribe(
      response =>{
        this.datos = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.totalDatos = response.meta.totalCount;

        //////////////////////////console.log(response.data)
      }
    )
    // this.productService.getListProductos().subscribe(resp=>{
    //   //////////////////////////console.log(resp)
    //   this.ListProductos = resp;
    // })
  }

  back(): void {
    if(this.previousPage != false){
      this.page--;
      if (this.page>0) {
        this.obtenerProductos();
      }else{
        this.page=1
      }
      
    }
  }

  next(): void {
    if(this.nextPage != false){
      this.page++;
      this.obtenerProductos();
    }
  }

  setPage(page: number): void {
    this.page = page + 1;
    this.obtenerProductos();
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
     // this.size = 1; //Busca sólo 1 registro
      this.page = 1;
      this.barraPaginado = false;
    }else{
      //this.size = 10;
      this.barraPaginado = true;
    }

    this.obtenerProductos();
  }

  eliminarRegistro(idRegistro){
    const data = {
      idProducto: idRegistro,
      activo:false
    }

    //////////console.log(data)

    Swal.fire({
      text: "¿Seguro que desea eliminar este producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00A1DE',
      cancelButtonColor: '#6e7d88',
      confirmButtonText: 'Entendido <i class="fa fa-check pl-2"></i>',
      cancelButtonText: '<i class="fa fa-times pr-2"></i> Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.productService.eliminarProducto(data).subscribe(resp=> {
          //////////////////////////console.log(resp)

          if (resp.valid) {
            Swal.fire({
              title: "Éxito!",
              text: resp.message,
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: '#00A1DE'
            });
            
            this.obtenerProductos();

          } else {
            Swal.fire({
              title: "Error!",
              text: "Se generó un error al eliminar el producto, inténtelo nuevamente.",
              icon: "error",
              confirmButtonText: "OK",
              confirmButtonColor: '#00A1DE'
            });
          }
        });
      }
    });
  }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    // ////////////////////console.log(this.datosUsuario)

    if (parseInt(this.datosUsuario.rol)==1) {
      this.idUsuario=0;
    }else{
      this.idUsuario=this.datosUsuario.id;
    }
    
    this.obtenerProductos();

  }

}
