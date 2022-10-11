import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LineaTiempoService } from 'src/app/services/lineaTiempo.service';

@Component({
  selector: 'app-linea-tiempo-formulario',
  templateUrl: './linea-tiempo-formulario.component.html',
  styleUrls: ['./linea-tiempo-formulario.component.scss']
})
export class LineaTiempoFormularioComponent implements OnInit {


  listaPasos:any=[
    /* {
      nroPaso:1,
      textoPaso:"Preevaluacion",
      fecharegistro:"2021-11-07",
      estado:"estado0",
      observaciones:"sin obs0",
      producto:"AGHASO COMBO TERMA 1 TERMA 5.5 LT LAVADORA ELECTRICA 12KG SILVER"
    },    
    {
      nroPaso:2,
      textoPaso:"Registro Regla Knockout",
      fecharegistro:"2021-11-08",
      estado:"estado",
      observaciones:"sin obs"
    },
    {
      nroPaso:3,
      textoPaso:"Registro Evaluacion cliente",
      fecharegistro:"2021-11-09",
      estado:"estado2",
      observaciones:"sin obs2"
    },
    {
      nroPaso:4,
      textoPaso:"Registro Evaluacion crediticia",
      fecharegistro:"2021-11-10",
      estado:"estado3",
      observaciones:"sin obs3"
    },
    {
      nroPaso:5,
      textoPaso:"Registro Carga Post Atencion",
      fecharegistro:"2021-11-11",
      estado:"estado4",
      observaciones:"sin obs4"
    }, */
    /* {
      nroPaso:5,
      textoPaso:"Paso 5"
    },
    {
      nroPaso:6,
      textoPaso:"Paso 6"
    }, */
  ]

  pasoActual:number=5;

  constructor(
    private dialogRef: MatDialogRef<LineaTiempoFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private lineaTiempoService:LineaTiempoService
  ) { }

  ngOnInit(): void {
    this.cargarData();
  }

  @HostListener('document:keyup.escape') onClose() {
    this.onCancel();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close("");
  }

  cargarData(){
    // //////////////////////////console.log(this.page);

    this.lineaTiempoService.getListFinanciamientoTemp(this.data.clave,this.data.id).subscribe( 
      response =>{
        /* console.log("DATA: "+JSON.stringify(response)) */
        this.listaPasos=response;

      }
    )
    
  }

}
