import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  rutaPDF = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  nombFilePdf = "Volver a adjuntar el documento"

  constructor() { }

  ngOnInit(): void {
  }

  uploadFilePdf(event){
    this.nombFilePdf = event.target.files[0].name;
  }

}
