import { Injectable } from '@angular/core';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService {

  constructor(private autorizaService: AuthorizesService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    let tk = this.autorizaService.getToken();
    if(tk){
      req = req.clone({
        setHeaders: {
          Authorization: "Bearer " + tk
        }
      });
    }
    return next.handle(req);
  }
}
