import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PreevaluationDialogComponent } from 'src/app/external-components/dialog-module/preevaluation-dialog/preevaluation-dialog.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-solicitud-financiamiento',
  templateUrl: './solicitud-financiamiento.component.html',
  styleUrls: ['./solicitud-financiamiento.component.scss']
})

export class SolicitudFinanciamientoComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
) { }

  ngOnInit(): void {
    //this.openPreevaluationDialog();
  }

  // openPreevaluationDialog() {
  //   this.dialog.open(PreevaluationDialogComponent, { 
  //     width: '650px',
  //     autoFocus: false,
  //     panelClass: 'dialog-custom-4',
  //     hasBackdrop: true }); 
  // } 
 openDialog() {
    this.dialog.open(ModalComponent);
  }
}


