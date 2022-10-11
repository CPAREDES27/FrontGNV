import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthorizesService } from 'src/app/services/authorizes.service';

@Injectable()
export class HttpRequestService implements HttpInterceptor { 
  constructor(private authService: AuthorizesService) 
  { 
  }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    //Obtener el token de autenticacion del servicio
    const authToken = this.authService.getToken();
    //Clone la solicitud y reemplace los encabezados originales
    //Los encabezados clonados, actualizados con la autorizacion
    const newRequest = req.clone({ body: {} });
    //Envia la solicitud clonada con encabezado al siguiente controlador
    return next.handle(newRequest);
  }

}
