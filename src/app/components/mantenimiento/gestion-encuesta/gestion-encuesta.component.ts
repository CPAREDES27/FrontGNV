import { Component, OnInit } from '@angular/core';
import { PreguntasModel } from 'src/app/models/encuesta/listaEncuesta.model';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-encuesta',
  templateUrl: './gestion-encuesta.component.html',
  styleUrls: ['./gestion-encuesta.component.scss']
})
export class GestionEncuestaComponent implements OnInit {

  listPreguntas: PreguntasModel;

  constructor( private mantenimientoService:MantenimientoService) { }

  ngOnInit(): void {
    this.obtenerListaEncuesta();
  }
  obtenerListaEncuesta(){
    this.mantenimientoService.getAllEncuesta().subscribe(resp=> {
      //////////////////////////console.log(resp)
      this.listPreguntas = resp;
    })

  }

  eliminarRegistro(idPregunta){
    const data = {
      idPregunta: idPregunta
    }
   
    Swal.fire({
      text: "¿Seguro que deseas dar de baja esta pregunta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00A1DE',
      cancelButtonColor: '#6e7d88',
      confirmButtonText: 'Entendido <i class="fa fa-check pl-2"></i>',
      cancelButtonText: '<i class="fa fa-times pr-2"></i> Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.mantenimientoService.eliminarPregunta(data).subscribe(resp=> {
          if (resp.valid) {
            Swal.fire({
              title: "Éxito!",
              text: resp.message,
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: '#00A1DE'
            });
            
            this.obtenerListaEncuesta();

          } else {
            Swal.fire({
              title: "Error!",
              text: "Se generó un error al dar de baja al usuario, intente nuevamente.",
              icon: "error",
              confirmButtonText: "OK",
              confirmButtonColor: '#00A1DE'
            });
          }
        });
      }
    });
  }
}
