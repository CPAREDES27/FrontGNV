import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PreguntasModel } from 'src/app/models/encuesta/listaEncuesta.model';
import { ListaPreguntasModel } from 'src/app/models/financiamiento/ListaPReguntas.model';
import { CommonService } from 'src/app/services/common.service';
import { FinanciamientoService } from 'src/app/services/financiamiento.service';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responde-encuesta',
  templateUrl: './responde-encuesta.component.html',
  styleUrls: ['./responde-encuesta.component.scss']
})
export class RespondeEncuestaComponent implements OnInit {
  //encuestaFormGroup : FormGroup;

  listaPrguntas: ListaPreguntasModel;

  listaPreguntas: PreguntasModel;

  messageSucces = [];

  pRespondidas: any = [];

  public formulario: FormGroup = null;
  public listaCampos: string[] = null;

  constructor(
    private financiamientoService:FinanciamientoService,
    private commonService:CommonService,
    private mantenimientoService:MantenimientoService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    //this.listarPreguntas1();
    this.crearCamposForm()
    //this.listarPreguntas();

   
  }
  crearCamposForm(){
    this.mantenimientoService.getAllEncuesta().subscribe(resp =>{
      this.listaCampos = [];
      for (var i in resp) {
       ////////////////////////////console.log(resp[i].id)
       ////////////////////////////console.log(i)
       this.listaCampos.push('campo' + (resp[i].id))
      }

      this.inicializarFormulario();
      
      setTimeout(() => {
        this.listarPreguntas()
    }, 500);
    });
  }

  listarPreguntas(){
    this.mantenimientoService.getAllEncuesta().subscribe(resp =>{
      ////////////////////////////console.log(resp)

      this.listaPreguntas = resp;
    });
  }

  inicializarFormulario() {
    let formularioTmp: FormGroup;
    let jsonString = '';
    
    this.listaCampos.forEach((campo, index) => {
      jsonString += `"${campo}":"",`;

      if (index === this.listaCampos.length - 1) {
        jsonString = `{${jsonString.slice(0, jsonString.length - 1)}}`;
        ////////////////////////////console.log(JSON.parse(jsonString));
        formularioTmp = this.formBuilder.group(JSON.parse(jsonString));
        ////////////////////////////console.log(formularioTmp)
        
        this.agregarValidaciones(formularioTmp);
      }
    });
  }

  agregarValidaciones(pFormulario: FormGroup) {
    ////////////////////////////console.log(pFormulario)

    this.listaCampos.forEach((campo, idx) => {
      ////////////////////////////console.log(pFormulario.controls[campo]);

      pFormulario.controls[campo].setValidators([
        Validators.required
      ]);

      if (idx === this.listaCampos.length - 1) {
        this.formulario = pFormulario;
      }
    });
  }

  validarFormulario(){
    if(this.formulario.valid){
      return true;
    }else{
      Swal.fire({
        title: "Observación!",
        text: "Por favor, responda todas las preguntas.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: '#00A1DE'
      });
      return false;
    }
  }

  GuardarPreguntas(){
    this.validarFormulario();
    //////////////////////////console.log(this.formulario.value);

    for (var i in this.formulario.value) {
      ////////////////////////////console.log(i.substr(5))

      //FALTA ENVIAR EL IDFINANCIAMIENTO EL CUAL VENDRA DESDE LAS 40 PREGUNTAS

      this.pRespondidas.push(
        {
          idPregunta: i.substr(5),
          idFinanciamiento: 0,
          respuesta: this.formulario.get(i).value
        }
      )
    }

    ////////////////////////////console.log(JSON.stringify( this.pRespondidas))

    this.mantenimientoService.registrarEncuestaRespuestas(this.pRespondidas).subscribe(resp=>{

      if (resp.valid) {
        Swal.fire({
          title: "Éxito!",
          text: resp.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });
  
        this.router.navigate(["/gnv"]);

      } else {
        Swal.fire({
          title: "Error!",
          text: "Se generó un error al guardar sus respuestas, intente nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });

        this.router.navigate(["/gnv"]);
      }
    })
    
  }
}
