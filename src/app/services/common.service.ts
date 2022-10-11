import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../external-components/dialog-module/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../external-components/dialog-module/success-dialog/success-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService { 
  constructor(
      private matDialog: MatDialog) { }
 
  getErrorHtmlList(errors: string[]) {
    const dialogRefError = this.matDialog.open(ErrorDialogComponent, {
      data: {
        listErrors: errors
      },
      width: '600px',
      autoFocus: false,
      panelClass: 'dialog-custom-2',
      disableClose: true
    });
  }

  getSuccessHtmlList(messageSuccess: string[],ruta:string) {
    const dialogRefSuccess = this.matDialog.open(SuccessDialogComponent, {
      data: {
        listMessage: messageSuccess,
        redireccionRuta: ruta
      },
      width: '600px',
      autoFocus: false,
      panelClass: 'dialog-custom-2',
      disableClose: true
    });
  }
}
