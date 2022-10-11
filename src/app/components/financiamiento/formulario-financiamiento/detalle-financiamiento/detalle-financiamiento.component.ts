import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-financiamiento',
  templateUrl: './detalle-financiamiento.component.html',
  styleUrls: ['./detalle-financiamiento.component.scss']
})

export class DetalleFinanciamientoComponent implements OnInit {

  formDatosFinanciamiento:FormGroup;

  isLinear = false;
  isEditable = true;
  constructor(
    private dialogRef: MatDialogRef<DetalleFinanciamientoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log("DATA RECIBIDA")
    console.log(this.data)
    this.formularioDatosFinanciamiento()
  }

  @HostListener('document:keyup.escape') onClose() {
    this.onCancel();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close();
  }

  formularioDatosFinanciamiento(){
    this.formDatosFinanciamiento = this.fb.group({
      idSfCliente: [{value:'',disabled: false}],
      idCliente: [{value:'',disabled: false}],
      nombres: [{value:'',disabled: false}],
      apellidos: [{value:'',disabled: false}],
      tipoDocumento: [{value:'',disabled: false}],
      numeroDocumento: [{value:'',disabled: false}],
      fechaNacimiento: [{value:'',disabled: false}],
      estadoCivil: [{value:'',disabled: false}],
      correoElectronico: [{value:'',disabled: false}],
      celular: [{value:'',disabled: false}],
      idNivelEstudios: [{value:'',disabled: false}],
      ocupacion: [{value:'',disabled: false}],
      tipoContrato: [{value:'',disabled: false}],
      mesAnio: [{value:'',disabled: false}],
      tiempoEmpleoCliente: [{value:'',disabled: false}],
      tipoCalle: [{value:'',disabled: false}],
      direccion: [{value:'',disabled: false}],
      numeroInterior: [{value:'',disabled: false}],
      mzLt: [{value:'',disabled: false}],
      distrito: [{value:'',disabled: false}],
      referenciaDomicilio: [{value:'',disabled: false}],
      tipoVivienda: [{value:'',disabled: false}],
      tiempoAnoVivienda: [{value:'',disabled: false}],
      tiempoMesesVivienda: [{value:'',disabled: false}],
      isGasNatural: [{value:'',disabled: false}],
      numeroPlaca: [{value:'',disabled: false}],
      marcaAuto: [{value:'',disabled: false}],
      modeloAuto: [{value:'',disabled: false}],
      fechaFabricacion: [{value:'',disabled: false}],
      numeroTarjetaPropiedad: [{value:'',disabled: false}],
      tipoUsoVehicular: [{value:'',disabled: false}],
      estadoVehiculo: [{value:'',disabled: false}],
      ingresoMensual: [{value:'',disabled: false}],
      numeroHijos: [{value:'',disabled: false}],
      producto: [{value:'',disabled: false}],
      nombreEstablecimiento: [{value:'',disabled: false}],
      precio: [{value:'',disabled: false}],
      tipoFinanciamiento: [{value:'',disabled: false}],
      tipoCredito: [{value:'',disabled: false}],
      plazoCuotasFinanciamiento: [{value:'',disabled: false}],
      montoFinanciamiento: [{value:'',disabled: false}],
      observaciones: [{value:'',disabled: false}],
      idTaller: [{value:'',disabled: false}],
      /* idCargaDocumentos: [{value:'',disabled: false}],
      numeroScore: [{value:'',disabled: false}],
      idPreevaluacion: [{value:'',disabled: false}],
      idTaller: [{value:'',disabled: false}],
      idTaller: [{value:'',disabled: false}],
      idTaller: [{value:'',disabled: false}], */

    });
    console.log(this.data.producto)
    this.formDatosFinanciamiento.patchValue(this.data)
  }


}
