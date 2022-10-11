import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioModel } from 'src/app/models/usuarios/usuario.model';
import { FinanciamientoService } from 'src/app/services/financiamiento.service';
import { FinanciamientoTempService } from 'src/app/services/financiamientoTemp.service';

@Component({
  selector: 'app-pendiente-formulario',
  templateUrl: './pendiente-formulario.component.html',
  styleUrls: ['./pendiente-formulario.component.scss']
})
export class PendienteFormularioComponent implements OnInit {



  datos: Array<any>;
  totalPages: Array<number>;

  totalDatos = 0;
  inputConsulta = '';
  page = 1;
  size = 10;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;

  datosUsuario:UsuarioModel;

  constructor(
    private dialogRef: MatDialogRef<PendienteFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private financiamientoTempService:FinanciamientoTempService
  ) { }

  ngOnInit(): void {
    this.cargarTabla();
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

  cargarTabla(){
    // //////////////////////////console.log(this.page);

    this.financiamientoTempService.getListFinanciamientoTemp(this.data.idTipoDocumento,this.data.numDocumento,this.page,this.size).subscribe( 
      response =>{
        console.log(JSON.stringify(response))
        this.datos = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.totalDatos = response.meta.totalCount;
        if(this.totalDatos==0){
          this.onCancel();
        }

        //  //////////////////////////console.log("DATA: "+JSON.stringify(response.data))
      }
    )
    
  }

  pintarDatosFinanciamiento(idsfcliente:number){
    this.financiamientoTempService.getByIdFinanciamientoTemp(idsfcliente).subscribe( 
      response =>{
        //console.log(JSON.stringify(response))
        this.dialogRef.close(response);
        //  //////////////////////////console.log("DATA: "+JSON.stringify(response.data))
      }
    )
  }

}
