import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalPdfComponent } from '../../evaluacion/modal-pdf/modal-pdf.component';

@Component({
  selector: 'app-detalle-consulta-datos',
  templateUrl: './detalle-consulta-datos.component.html',
  styleUrls: ['./detalle-consulta-datos.component.scss']
})
export class DetalleConsultaDatosComponent implements OnInit {

  formDatosUsuario:FormGroup;
  formDetalleExpediente:FormGroup;
  
  nombFileComPago = 'Adjuntar documento';
  constructor(private formBuilder: FormBuilder,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.formularioDatos();
    this.crearFormReglasInsert();
  }

  formularioDatos(){
    this.formDatosUsuario = this.formBuilder.group({
      nombreCliente: [{value:'Juan Enrique',disabled: true}],
      apellidoCliente: [{value:'Lopez Beltran',disabled: true}],
      numeroDocumento: [{value:'40401212',disabled: true}],
      fechaNacimiento: [{value:'1998-05-12',disabled: true}],
      telefonoFijo: [{value:'48450014',disabled: true}],
      numeroCelular: [{value:'987650001',disabled: true}],
      correoElectronico: [{value:'jlopez@gmail.com',disabled: true}],
    });
  }

  crearFormReglasInsert(){
    this.formDetalleExpediente =  this.formBuilder.group({

      fileSustento: [''],
      
    })
  }

  openDialogPdf(){
    this.dialog.open(ModalPdfComponent);
  }

}
