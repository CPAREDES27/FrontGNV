import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { EstadosService } from 'src/app/services/estados.service';




@Component({
  selector: 'app-modal-prev-pdf',
  templateUrl: './modal-prev-pdf.component.html',
  styleUrls: ['./modal-prev-pdf.component.scss']
})
export class ModalPrevPdfComponent implements OnInit {


  _base64ToArrayBuffer(base64) {
	  var binary_string = base64.replace(/\\n/g, '');
    binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
    }

  base64;
  pageVariable = 1;
  validacionDoc:boolean=true;

  constructor(
    public dialogRef: MatDialogRef<ModalPrevPdfComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data,
    private estadoService:EstadosService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,

  ) { }

  ngOnInit(): void {
    webPreferences: {
      webSecurity: false
    }

    console.log(this.data)
    console.log(this.data.urlArchivo)
    if (this.data.urlArchivo==undefined) {
      this.base64=this._base64ToArrayBuffer(this.data.fileBase64)
    }else{
      this.base64=this.data.urlArchivo;
    }
    

  } 

  afterLoadComplete(pdf: any) {
    /* //////console.log('after-load-complete'); */
  }

  pageRendered(e: CustomEvent) {
    /* //////console.log('(page-rendered)', e); */
  }

  textLayerRendered(e: CustomEvent) {
    /* //////console.log('(text-layer-rendered)', e); */
  }

}
