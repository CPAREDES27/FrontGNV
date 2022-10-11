import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JsonResult } from '../models/json-result';
import { MarcaModel } from '../models/productos/marca.model';
import { ProductoModel } from '../models/productos/producto.model';
import { ProveedorModel } from '../models/productos/proveedor.model';
import { TipoProductoModel } from '../models/productos/tipoProducto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  urlServicesGnv: string = environment.urlServicesGnv; 

  constructor(private httpClient: HttpClient) { }
  
  getListProductos(): Observable<ProductoModel>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/ListProduct`;
    return this.httpClient.get<ProductoModel>(urlBackServiceGnv)
  }

  getListProductosPaginacion(page:number,size:number,filtro:string,idUsuarioProveedor:number): Observable<any> {

    /* const urlBackServiceGnv = `${this.urlServicesGnv}Product/AllProductPag_homo?PageSize=${size}&PageNumber=${page}&Descripcion=${filtro}`;
    return this.httpClient.get<any>(urlBackServiceGnv) */

    const urlBackServiceGnv = `${this.urlServicesGnv}Product/AllProductPag_homo`;
    let httpParams = JSON.stringify({
      "idProducto": 0,
      "descripcion": filtro,
      "precio": 0,
      "imagen": "",
      "numOrden": 0,
      "numeroPagina": page,
      "numeroRegistros": size,
      "idProveedor":idUsuarioProveedor
    });
    ////////console.log(httpParams)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParams, { headers: mheaders });  



  }
  getProductoPorId(id: number): Observable<ProductoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/GetProductById?idProducto=${id}`;
    return this.httpClient.get<ProductoModel>(urlBackServiceGnv)
  }

  registrarProducto(datosProducto: ProductoModel): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/RegisterProduct`;  
    let httpParams = JSON.stringify(datosProducto);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  } 

  actualizarProducto(datosProducto: ProductoModel): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/UpdateProduct`;  
    let httpParams = JSON.stringify(datosProducto);
    //////////console.log(httpParams)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  } 

  eliminarProducto(data): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/UpdateStatusProduct`;  
    let httpParams = JSON.stringify(data);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv,httpParams, { headers: mheaders });  
  } 

  getProductoMarca(): Observable<MarcaModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/ListMarca`;
    return this.httpClient.get<MarcaModel>(urlBackServiceGnv)
  }
  getProductoProveedor(): Observable<ProveedorModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/ListProveedor`;
    return this.httpClient.get<ProveedorModel>(urlBackServiceGnv)
  }
  getProductoTipo(): Observable<TipoProductoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/ListTipoProduct`;
    return this.httpClient.get<TipoProductoModel>(urlBackServiceGnv)
  }


  listarMarcaTipoProductoProveedor(idUsuario:number,idRol:number): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Product/ListMaestroProduct?IdUsuario=${idUsuario}&IdRol=${idRol}`;
    return this.httpClient.get<JsonResult<any>>(urlBackServiceGnv)
  } 



}
