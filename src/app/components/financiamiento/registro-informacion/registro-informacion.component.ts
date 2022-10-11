import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { date, toDate } from '@rxweb/reactive-form-validators';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { ListaTalleresModel } from 'src/app/models/financiamiento/talleres.model';
import { ProductoModel } from 'src/app/models/productos/producto.model';
import { DepartamentoModel, DistritoModel, ProvinciaModel } from 'src/app/models/ubigeo/ubigeo.model';
import { UsuarioModel } from 'src/app/models/usuarios/usuario.model';
import { DatosAdicionalesUsuario } from 'src/app/models/usuarios/usuarioDatosAdicionales.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CommonService } from 'src/app/services/common.service';
import { FinanciamientoService } from 'src/app/services/financiamiento.service';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import { ProductService } from 'src/app/services/product.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { WINDOW } from 'src/app/services/windows.service';
import { GlobalVariable } from '../../global';

@Component({
  selector: 'app-registro-informacion',
  templateUrl: './registro-informacion.component.html',
  styleUrls: ['./registro-informacion.component.scss']
})
export class RegistroInformacionComponent implements OnInit {

   //Cuando el cliente dejo de escribir por 1 segundo
   timeout: any = null;

  userFormGroup : FormGroup;  
  idUsuario:number=0;
  idProducto:number=0;
  idPreevaluacion:number=0;
  
  datosUsuario:AuthorizeModel;
  datosCliente:UsuarioModel;
  datosClienteAdicionales:DatosAdicionalesUsuario;

  mostrarBotonActualizar:boolean=false;

  listTalleres:ListaTalleresModel;

  productoSeleccionado:ProductoModel={};

  mostrarProductoTaller:Boolean=false;

  listaDepartamento:DepartamentoModel;
  listaProvincia:ProvinciaModel;
  listaDistrito:DistritoModel;

  constructor(
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private mantenimientoService:MantenimientoService,
    private authorizesService:AuthorizesService,
    private commonService:CommonService,
    private datePipe: DatePipe,
    private financiamientoService:FinanciamientoService,
    private productService:ProductService,
    private ubigeoService:UbigeoService,
    @Inject(WINDOW) public window: Window
    ) { }

  ngOnInit(): void {
    this.crearForm();
    this.obtnerDatosUSerLogeado();
    

  
  }

  crearForm(){

    
    
    this.userFormGroup = this.formBuilder.group({
      clienteNombre: ['',[Validators.required]],
      clienteApellido: ['',[Validators.required]],
      clienteCorreo:['',[Validators.required]],
      modeloVehiculo: ['',[Validators.required]],
      marcaVehiculo: ['',[Validators.required]],
      /* fechaFabricacion: ['',[Validators.required]], */
      direccionEntrega: [''],
      direccionResidencia: ['',[Validators.required]],
      departamento: ['',[Validators.required]],
      provincia: ['',[Validators.required]],
      distrito: ['',[Validators.required]],
      fechaNacimiento: ['',[Validators.required]],
      productoNombre: ['',[Validators.required]],
      productoPrecio: ['',[Validators.required]],
      tallerSeleccionado: ['',[Validators.required]],

    })

    this.route.params.subscribe(data=>{
      this.idUsuario = data['idUsuario'];
      this.idProducto = data['idProducto'];
      this.idPreevaluacion = data['idPreevaluacion'];
     //this.obtenerDatos(this.idPreevaluacion);
    //  ////////////////console.log(this.idUsuario)
     this.obtenerDepartamento();
     this.consultarDatosCliente();
     
    });
  }
  
  prepararRegistro(){

  }


  consultarDatosCliente(){
    try {


      this.mantenimientoService.getUsuarioPorId(this.idUsuario).subscribe(resp =>{

        this.datosCliente=resp[0];

        ////////console.log("obtenerDatosGeneralesCliente: "+JSON.stringify(this.datosCliente))

        if (this.datosCliente!=undefined) {
          this.userFormGroup.patchValue({
            clienteNombre:this.datosCliente.nomCliente,
            clienteApellido:this.datosCliente.apeCliente,
            clienteCorreo:this.datosCliente.usuarioEmail,
          })
          
   
          this.consultarDatosAdicionalesCliente();
        }else{
          //alert("NO EXISTE USUARIO")

        this.userFormGroup.disable();

        let errors = [];
            // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        errors.push(GlobalVariable.usuarioNoExisteEvCliente);
        this.commonService.getErrorHtmlList(errors);
        }

      });
    } catch (error) {
      
    }
  }

  consultarDatosAdicionalesCliente(){
    try {

      this.mostrarBotonActualizar=false

      this.mantenimientoService.consultarDatosAdicionales(this.idUsuario,this.idPreevaluacion).subscribe(resp =>{

        
        if (resp.valid) {

          this.mostrarBotonActualizar=true;
          this.datosClienteAdicionales=resp;

          if (this.datosClienteAdicionales.idDepartamento!="0") {
            this.obtenerProvincia({value:this.datosClienteAdicionales.idDepartamento});
            this.obtenerDistrito({value:this.datosClienteAdicionales.idProvincia});
          }

          this.userFormGroup.patchValue({
            modeloVehiculo:this.datosClienteAdicionales.modeloAuto,
            marcaVehiculo:this.datosClienteAdicionales.marcaAuto,
            /* fechaFabricacion:this.datePipe.transform(this.datosClienteAdicionales.fechaFabricacion,'yyyy-MM-dd'), */
            direccionEntrega:this.datosClienteAdicionales.direccionEntrega,
            fechaNacimiento:this.datePipe.transform(this.datosClienteAdicionales.fechaNacimiento,'yyyy-MM-dd'),
            tallerSeleccionado:this.datosClienteAdicionales.idTaller,
            departamento:this.datosClienteAdicionales.idDepartamento,
            provincia:this.datosClienteAdicionales.idProvincia,
            distrito:this.datosClienteAdicionales.idDistrito,
            direccionResidencia:this.datosClienteAdicionales.direccionResidencia,
          })  
          
          
        }

        this.ListProductosById();

  
      });
    } catch (error) {
      
    }
  }

  insertarActualizarDatosAdicionales(){
        
        var datosAdicionales:DatosAdicionalesUsuario;
        datosAdicionales=({
          idUsuario:this.datosCliente.idUsuario,
          nomCliente:this.userFormGroup.get("clienteNombre").value,
          apeCliente:this.userFormGroup.get("clienteApellido").value,
          modeloAuto:this.userFormGroup.get("modeloVehiculo").value,
          marcaAuto:this.userFormGroup.get("marcaVehiculo").value,
          //fechaFabricacion era detipo Date
          /* fechaFabricacion:this.userFormGroup.get("fechaFabricacion").value, */
          fechaFabricacion:'1999-01-01',
          direccionEntrega:this.userFormGroup.get("direccionEntrega").value,
          fechaNacimiento:this.userFormGroup.get("fechaNacimiento").value,
          observacion:"",
          idUsuarioRegistro:this.datosUsuario.id,
          idTaller:this.userFormGroup.get("tallerSeleccionado").value,
          idPreevaluacion:this.idPreevaluacion,
          idDepartamento:this.userFormGroup.get("departamento").value,
          idProvincia:this.userFormGroup.get("provincia").value,
          idDistrito:this.userFormGroup.get("distrito").value,
          telefonoFijo:"",
          telefonoMovil:"",
          direccionResidencia:this.userFormGroup.get("direccionResidencia").value
        })
        //////console.log(JSON.stringify(datosAdicionales))
  
        this.mantenimientoService.insertarActualizarDatosAdicionales(datosAdicionales).subscribe(resp =>{
  
          ////////////////console.log(resp)
          if (resp.valid) {
            let respuesta = [];
            respuesta.push(resp.message);

            if (this.window.opener) {
              this.commonService.getSuccessHtmlList(respuesta,''); 
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.window.close();
              }, 1000);
            }else{
              this.commonService.getSuccessHtmlList(respuesta,'/gnv/preevaluacion'); 
            }

          }else{
            let errors = [];
          errors.push(resp.message);
          this.commonService.getErrorHtmlList(errors); 
          }
  
        });

  }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    // ////////////////console.log(this.datosUsuario)

  }

  cerrar() { 
    window.open('','_parent',''); 
    window.close(); 
  } 

  obtenerTalleres(filtro:string,idProveedor:number,tipoProducto:number){
    // //////////////////////console.log(this.productoSeleccionado.idProveedorProducto)
    this.financiamientoService.getListTalleres(filtro,idProveedor,tipoProducto).subscribe(resp =>{
      // //////////////////////////console.log(resp)
      this.listTalleres  = resp ;
      ////////////console.log(resp)
    });
  }
  ListProductosById(){
    //this.formPreevaluation.controls['productoFinanciar'].setValue(2);

    this.productService.getProductoPorId(this.idProducto).subscribe(resp=>{
      // //////////////////////////console.log(resp)

      //this.people.push(resp);
      this.productoSeleccionado = resp;

      this.mostrarProductoTaller=this.productoSeleccionado.flagProductoGNV

      this.userFormGroup.patchValue({
        productoNombre:this.productoSeleccionado.descripcion,
        productoPrecio:this.productoSeleccionado.precio
      })

      if (this.mostrarProductoTaller) {
        this.obtenerTalleres('',this.productoSeleccionado.idProveedorProducto,this.productoSeleccionado.idTipoProducto);
      }else{
        this.userFormGroup.get('productoNombre').setValidators([]); // or clearValidators()
        this.userFormGroup.get('productoNombre').updateValueAndValidity();

        this.userFormGroup.get('productoPrecio').setValidators([]); // or clearValidators()
        this.userFormGroup.get('productoPrecio').updateValueAndValidity();

        this.userFormGroup.get('tallerSeleccionado').setValidators([]); // or clearValidators()
        this.userFormGroup.get('tallerSeleccionado').updateValueAndValidity();

      }

    })
  }

  obtenerDepartamento(){
    this.ubigeoService.getDepartamentos().subscribe(resp=>{
      this.listaDepartamento = resp;
    });
  }

  obtenerProvincia(departamento){
    this.ubigeoService.getProvincia(departamento.value).subscribe(resp=>{
      this.listaProvincia = resp;
      ////////console.log(this.listaProvincia)
    });
  }

  obtenerDistrito(provincia){
    this.ubigeoService.getDistrito(provincia.value).subscribe(resp=>{
      this.listaDistrito = resp;
      ////////console.log(this.listaDistrito)
    });
  }

  cancelar(){
    if (this.window.opener) {
      this.window.close();
    }
  }
}
