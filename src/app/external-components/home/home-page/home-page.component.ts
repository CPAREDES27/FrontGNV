import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductoModel } from 'src/app/models/productos/producto.model';
import { ProductService } from 'src/app/services/product.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TipoProductoModel } from 'src/app/models/productos/tipoProducto.model';
import { MarcaModel } from 'src/app/models/productos/marca.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }

  formFiltro : FormGroup;  

  datos: Array<any>;
  totalPages: Array<number>;

  totalDatos = 0;
  inputConsulta = '';
  page = 1;
  size = 12;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;

  tipoProducto:TipoProductoModel;
  datosMarca:MarcaModel;

  mostrarDivAbsolute:Boolean=false;

  images = [
    {path: 'assets/images/imgSlider.png'},
    {path: 'assets/images/imgSlider.png'},
    {path: 'assets/images/imgSlider.png'},
    {path: 'assets/images/imgSlider.png'},
  ]

  styleObject = [
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
    {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"}
  ]

  contBannerSeleccionado:number=undefined;

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
  if (event.srcElement.scrollTop >= 478) {
    this.mostrarDivAbsolute=true;
  }else{
    this.mostrarDivAbsolute=false;
  }
  }


  constructor(
    private productService:ProductService,
    private formBuilder: FormBuilder) {
  
   
 
   }

  ngOnInit(): void {
    this.obtenerProductos();
    this.formularioDatos();
    this.crearForm();
  }


  gotoTop() {
    const element = document.querySelector('#scrollId');
    element.scrollIntoView();
  }

  

  obtenerProductos(){
    this.productService.getListProductosPaginacion(this.page,this.size,this.inputConsulta.toUpperCase(),0).subscribe(
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
      this.obtenerProductos();
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
      this.page = 1;
      this.barraPaginado = false;
    }else{
      //this.size = 10;
      this.barraPaginado = true;
    }

    this.obtenerProductos();
  }

  redireccionarAyuda(url:string,columna:number): void{

    this.styleObject = [
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"},
      {color:"#00A1DE","padding-top":"14px","cursor":"pointer","font-weight": "600"}
    ]

    this.styleObject[columna].color="white"

    this.contBannerSeleccionado=columna;

    if (url!="SinRedireccion") {
      var url=url
      var win = window.open(url, '_blank');
      // Cambiar el foco al nuevo tab (punto opcional)
      win.focus();
    }

    if (columna==0) {
      this.gotoTop()
    }
    
  }

  hover(columna:number){

    /* for (let i = 0; i < this.styleObject.length; i++) {
      if (i==columna) {
        this.styleObject[i].color="white"
      }else{
        this.styleObject[i].color="#00A1DE"
      }
    } */
    
    this.styleObject[columna].color="white"

  }

  desactive(columna:number){
    if (this.contBannerSeleccionado!=columna) {
      this.styleObject[columna].color="#00A1DE"
    }
    
  }

}
