import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { AuthorizesService } from 'src/app/services/authorizes.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authorizesService: AuthorizesService,
    private snackBar : MatSnackBar
    ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 401) {
          this.authorizesService.signOff();
        } else {
          //console.log(err)
          const mensaje = err.statusText;
          //const mensaje = "Conexión rechazada."
          this.snackBar.open(mensaje, 'Aceptar', {duration: 5000, horizontalPosition: "left"}) 
        }      
        return throwError(err);  
      })
    );
  }
}
