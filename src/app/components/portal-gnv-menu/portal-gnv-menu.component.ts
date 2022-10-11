import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { RouteInfo } from 'src/app/models/interfaces/menu/routeinfo.model';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { MenuOptionsModel } from 'src/app/models/menu/menuOptions.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { PortalGnvContainerComponent } from '../portal-gnv-container/portal-gnv-container.component';

@Component({
  selector: 'app-portal-gnv-menu',
  templateUrl: './portal-gnv-menu.component.html',
  styleUrls: ['./portal-gnv-menu.component.scss']
})
export class PortalGnvMenuComponent implements OnInit {
  usercredentials: AuthorizeModel;
  //menuOptions: MenuOptionsModel[] = [];
  menuOptions: MenuOptionsModel[];

  menuOpciones: any[];

  public menuItems: any[];
  public isCollapsed = true;
  constructor(private authorizesService: AuthorizesService, private _toggle:PortalGnvContainerComponent) { }

  ngOnInit(): void {
    this.getOptions();
  }

  getOptions(): void {
    this.usercredentials = this.authorizesService.getUserAuth();
    // //////////////////////////console.log("DATOS USUARIO: "+JSON.stringify(this.usercredentials))
    this.authorizesService.listOptions(this.usercredentials.rol).subscribe(res => {
      // //////////////////////////console.log(JSON.stringify(res))
      //this.menuOptions = res;
      this.menuOptions = res['menus']['menusPadre'];

      ////////////////console.log(JSON.stringify(this.menuOptions))
      
    });
  }

  toggleMenu(){
    this._toggle.toggleClass();
  }

}
