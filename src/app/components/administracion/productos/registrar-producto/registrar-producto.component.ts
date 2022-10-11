import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductoModel } from 'src/app/models/productos/producto.model';
import { MarcaModel } from 'src/app/models/productos/marca.model';
import { CommonService } from 'src/app/services/common.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import { ProveedorModel } from 'src/app/models/productos/proveedor.model';
import { TipoProductoModel } from 'src/app/models/productos/tipoProducto.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { AuthorizeModel } from 'src/app/models/authorize.model';

@Component({
  selector: 'app-registrar-producto',
  templateUrl: './registrar-producto.component.html',
  styleUrls: ['./registrar-producto.component.scss']
})
export class RegistrarProductoComponent implements OnInit {
  productFormGroup : FormGroup;
  datosProducto = new ProductoModel();

  datosProductosEditar : ProductoModel;
  datosMarca:MarcaModel;
  datosProveedor:ProveedorModel;
  tipoProducto:TipoProductoModel;
  idProducto = 0;

  datosUsuario:AuthorizeModel;

  nobFileProducto = 'Agregar imagen producto';

  insertarImagenNueva:boolean=false;

  constructor( 
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private productService: ProductService,
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private authorizesService:AuthorizesService,
  ) { }

  ngOnInit(): void {
    if(this.router.url.includes('editar-producto') ) {
      this.activatedRoute.params
      .pipe(
        switchMap(({id})=> this.productService.getProductoPorId(id))
      ).subscribe(prod => {
        //////////////////////////console.log(prod)
        this.datosProductosEditar = prod;
        this.idProducto = this.datosProductosEditar.idProducto;
        this.cargarDatosParaEditar();
      })
    }

    this.createForm()
    /* this.mostrarMarcas();
    this.mostrarProveedor();
    this.mostrarTipoProducto(); */
    this.obtnerDatosUSerLogeado();
  }
  
  cargarDatosParaEditar(){

    this.productFormGroup.controls['tipoProducto'].setValue(this.datosProductosEditar.idTipoProducto);
    this.productFormGroup.controls['marca'].setValue(this.datosProductosEditar.idMarcaProducto);
    this.productFormGroup.controls['proveedor'].setValue(this.datosProductosEditar.idProveedorProducto);
    this.productFormGroup.controls['descripcion'].setValue(this.datosProductosEditar.descripcion);
    this.productFormGroup.controls['precio'].setValue(this.datosProductosEditar.precio);
    //this.productFormGroup.controls['imagen'].setValue(this.datosProductosEditar.imagen);
    this.productFormGroup.controls['orden'].setValue(this.datosProductosEditar.numOrden);
    this.productFormGroup.controls['estado'].setValue(this.datosProductosEditar.idEstado==1?true:false);
    this.productFormGroup.controls['codigo'].setValue(this.datosProductosEditar.codigoCalidda);
  }

  createForm() {
    this.productFormGroup = this.formBuilder.group({
      marca: ['', [Validators.required]],
      tipoProducto: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      //imagen: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fileImagenProducto: [''],
    });
  }

  mostrarMarcaProveedorTipoProducto(idUsuario:number,idRol:number){
    this.productService.listarMarcaTipoProductoProveedor(idUsuario,idRol).subscribe(resp=>{
      this.datosMarca=resp.listMarcaProducto;
      this.datosProveedor=resp.listProveedorProducto;
      this.tipoProducto=resp.listTipoProducto;
     });
  }

  mostrarMarcas(){
    this.productService.getProductoMarca().subscribe(resp=>{
     this.datosMarca=resp;
    });

  }

  mostrarProveedor(){

    this.productService.getProductoProveedor().subscribe(resp=>{
      this.datosProveedor=resp;
     });

  }

  mostrarTipoProducto(){

    this.productService.getProductoTipo().subscribe(resp=>{
      this.tipoProducto=resp;
     });

  }

  validarFormulario(){
    if(this.productFormGroup.valid){
      return true;
    }
    else{
      let errors = [];
      if (this.productFormGroup.get('marca').hasError('required')) errors.push('Ingrese marca del producto.');
      if (this.productFormGroup.get('proveedor').hasError('required')) errors.push('Ingrese proveedor del producto.');
      if (this.productFormGroup.get('tipoProducto').hasError('required')) errors.push('Ingrese tipo de producto.');
      if (this.productFormGroup.get('codigo').hasError('required')) errors.push('Ingrese codigo del producto.');
      if (this.productFormGroup.get('descripcion').hasError('required')) errors.push('Ingrese descripción del producto.');
      if (this.productFormGroup.get('precio').hasError('required')) errors.push('Ingrese precio del producto.');
      //if (this.productFormGroup.get('imagen').hasError('required')) errors.push('Ingrese nombre del ícono.');
      if (this.productFormGroup.get('orden').hasError('required')) errors.push('Ingrese orden a mostrar.');
      if (this.productFormGroup.get('estado').hasError('required')) errors.push('Ingrese el estado del producto.');
      
      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }

  prepararRegistro(){
    if(this.validarFormulario()){
      this.datosProducto.descripcion = this.productFormGroup.get('descripcion').value.toUpperCase();
      this.datosProducto.precio = parseInt(this.productFormGroup.get('precio').value);
      //Nombre de la imagen y extension
      //this.datosProducto.imagen = this.productFormGroup.get('imagen').value;
      this.datosProducto.numOrden = parseInt(this.productFormGroup.get('orden').value);
      this.datosProducto.activo = this.productFormGroup.get('estado').value;
      this.datosProducto.idTipoProducto=parseInt(this.productFormGroup.get('tipoProducto').value);
      this.datosProducto.idMarca=parseInt(this.productFormGroup.get('marca').value);
      this.datosProducto.idProveedor=parseInt(this.productFormGroup.get('proveedor').value);
      //this.datosProducto.imagenBase64=""
      this.datosProducto.idUsuarioRegistro=this.datosUsuario.id
      this.datosProducto.codigoProducto=this.productFormGroup.get('codigo').value;
      //////console.log(JSON.stringify(this.datosProducto));
      if (this.insertarImagenNueva==false) {
        this.datosProducto.imagenBase64="0"
        this.datosProducto.imagen ="sinImagen.jpg"
      }
      this.registrarProducto();

    }
    
  }

  registrarProducto(){
    this.productService.registrarProducto(this.datosProducto).subscribe(resp=>{
      if (resp.valid) {
        Swal.fire({
          title: "Éxito!",
          text: resp.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });
  
        this.router.navigate(["/gnv/productos"]);

      } else {
        Swal.fire({
          title: "Error!",
          text: "Se generó un error al registrar el producto, inténtelo nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });

        this.router.navigate(["/gnv/productos"]);
      }
    });
    
  }

  //EDITAR PRODUCTO
  prepararActualizar(){
    if(this.validarFormulario()){
 
      this.datosProducto.idProducto=this.idProducto
      this.datosProducto.descripcion = this.productFormGroup.get('descripcion').value.toUpperCase();
      this.datosProducto.precio = parseInt(this.productFormGroup.get('precio').value);
      //Nombre de la imagen y extension
      //this.datosProducto.imagen = this.productFormGroup.get('imagen').value;
      this.datosProducto.numOrden = parseInt(this.productFormGroup.get('orden').value);
      this.datosProducto.activo = this.productFormGroup.get('estado').value;;
      this.datosProducto.idTipoProducto=parseInt(this.productFormGroup.get('tipoProducto').value);
      this.datosProducto.idMarca=parseInt(this.productFormGroup.get('marca').value);
      this.datosProducto.idProveedor=parseInt(this.productFormGroup.get('proveedor').value);
      //this.datosProducto.imagenBase64=""
      this.datosProducto.idUsuarioRegistro=this.datosUsuario.id

      if (this.insertarImagenNueva==false) {
        var imagenNombre=this.datosProductosEditar.imagen.split("/")
        this.datosProducto.imagenBase64="0"
        this.datosProducto.imagen =imagenNombre[4]
      }
      //////////console.log(JSON.stringify(this.datosProducto));
      this.actualizarProducto();
    }
  }

  actualizarProducto(){
    this.productService.actualizarProducto(this.datosProducto).subscribe(resp=>{
      if (resp.valid) {
        Swal.fire({
          title: "Éxito!",
          text: resp.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });
  
        this.router.navigate(["/gnv/productos"]);

      } else {
        Swal.fire({
          title: "Error!",
          text: "Se generó un error al actualizar el producto, inténtelo nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });

        this.router.navigate(["/gnv/productos"]);
      }
    });
  }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    this.mostrarMarcaProveedorTipoProducto(this.datosUsuario.id,parseInt(this.datosUsuario.rol))
  }

  uploadImagenProducto(event) {
    // //////////////////////////console.log(event);
    this.transformarBase64(event.target)
    // this.nobFileFormDatos = event.target.files[0].name;
    // //////////////////////////console.log(event.target.files[0].name);
  }

  transformarBase64(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      ////////////console.log(myReader.result.toString())
      //var separarTipoDato=myReader.result.toString().split("base64,")
      this.nobFileProducto=inputValue.files[0].name;
      this.datosProducto.imagen=this.nobFileProducto
      this.datosProducto.imagenBase64=myReader.result.toString()
      this.insertarImagenNueva=true;
          
    }
    myReader.readAsDataURL(file);
  }
}
