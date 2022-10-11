import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizesService } from 'src/app/services/authorizes.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authorizesService: AuthorizesService){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let tk = this.authorizesService.getToken();
      if(!tk){
        //////////////////////////console.log('authorizesService.signOff');
        
        this.authorizesService.signOff();
      }
    return true;
  }
  
}
