import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthorizesService } from 'src/app/services/authorizes.service';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent implements OnInit {
  listMessage: any[] = []
  redireccionRuta:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authorizesService: AuthorizesService,private router: Router) { }

  ngOnInit(): void {
    this.listMessage = this.data.listMessage;
    this.redireccionRuta = this.data.redireccionRuta;
  } 

  redirectRoot(ruta:string): void{
    if(ruta=="SinRuta"){

      //this.authorizesService.+metodoRuta;

    }else if (ruta.length > 0) {
      this.router.navigate([ruta]);
    }else{
      this.authorizesService.redirectLogin();
    }
  } 
}
