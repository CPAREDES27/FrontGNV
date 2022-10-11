import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EncuestaModel } from 'src/app/models/encuesta/encuesta.model';
import { PreguntasModel } from 'src/app/models/encuesta/listaEncuesta.model';
import { CommonService } from 'src/app/services/common.service';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-encuesta',
  templateUrl: './registrar-encuesta.component.html',
  styleUrls: ['./registrar-encuesta.component.scss']
})
export class RegistrarEncuestaComponent implements OnInit {

  questionFormGroup: FormGroup;
  datosEncuesta = new EncuestaModel();

  datosEncuestaEditar: PreguntasModel;

  isCampoTexto = false;
  isOpciones = false;

  idPregunta = 0;

  public listOpciones: any = [];
  //public listOpcionesUpdate: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private mantenimientoService: MantenimientoService,
    private activatedRoute:ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.router.url.includes('editar-encuesta') ) {
      this.activatedRoute.params
      .pipe(
        switchMap(({id})=> this.mantenimientoService.getEncuestaPorId(id))
      ).subscribe(encuesta => {
        //////////////////////////console.log(encuesta[0])
        this.datosEncuestaEditar = encuesta[0];
        this.idPregunta = this.datosEncuestaEditar.id;
        this.cargarDatosParaEditar();
      })
    }

    this.createForm()
  }

  createForm() {
    this.questionFormGroup = this.formBuilder.group({
      pregunta: ['', [Validators.required]],
      textoAyuda: [''],
      tipoPregunta: ['', [Validators.required]],
      inputOpciones: [''],
     
    });
  }

  cargarDatosParaEditar(){
    this.tipoPregunta(this.datosEncuestaEditar.tipoDato);

    this.questionFormGroup.controls['pregunta'].setValue(this.datosEncuestaEditar.pregunta);
    this.questionFormGroup.controls['textoAyuda'].setValue(this.datosEncuestaEditar.textAyuda);
    this.questionFormGroup.controls['tipoPregunta'].setValue(this.datosEncuestaEditar.tipoDato);

    this.datosEncuestaEditar.opciones.forEach(item =>{
      //////////////////////////console.log(item.descripcion)
      this.listOpciones.push(
        {
          //idDetalle: item.idDetalle,
          idDetalle: 0,
          idPregunta: this.idPregunta,
          descripcionDetalle: item.descripcion,
          activoDetalle:true
        }
      )
    });
  }

  tipoPregunta(event){
    this.limpiarLista();
    switch(event) {
      case 'campo':
          this.isCampoTexto = true;
          this.isOpciones = false;
        break;
      case 'radio':
        this.isOpciones = true;
        this.isCampoTexto = false;
      break;
        case 'checkbox':
          this.isOpciones = true;
          this.isCampoTexto = false;
        break;
      case 'combo':
        this.isOpciones = true;
        this.isCampoTexto = false;
        break;
    }
  }

  limpiarLista(){
    this.listOpciones = [];
  }

  addOpciones(): void {
    let data = this.questionFormGroup.get('inputOpciones').value;
    //////////////////////////console.log(data)
    
    if(data.length > 0) {
        this.listOpciones.push(
          { 
            idDetalle: 0,
            idPregunta: this.idPregunta,
            descripcionDetalle: data,
            activoDetalle:true
          }
        )
        this.questionFormGroup.get('inputOpciones').reset();
    }
  }

  sliceOpciones(valor){
    //////////////////////////console.log(valor)
    let filtroLI = this.listOpciones.filter(e => e.descripcionDetalle === valor);
    filtroLI.forEach( x =>  this.listOpciones.splice(this.listOpciones.findIndex(q => x.descripcionDetalle === q.descripcionDetalle), 1));
  }

  validarFormulario(){
    if(this.questionFormGroup.valid){
      return true;
    }
    else{
      let errors = [];
      if (this.questionFormGroup.get('pregunta').hasError('required')) errors.push('Ingrese pregunta.');
      if (this.questionFormGroup.get('tipoPregunta').hasError('required')) errors.push('Seleccione tipo de pregunta.');
      
      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }

  valListaOpciones(){
    //////////////////////////console.log('TDato: '+this.isCampoTexto)

    if(this.isCampoTexto){
      return true;
    }else{
      //////////////////////////console.log(this.listOpciones.length)

      //Validamos que el detalle almenos sea mayor o igual a 2
      if(this.listOpciones.length >= 2){
        return true;
      }else{
        let errors = [];
        errors.push('Ingrese al menos 2 opciones para el tipo de pregunta.');
        this.commonService.getErrorHtmlList(errors);
        return false;
      }
    }

  }

  prepararRegistro(){
    if(this.validarFormulario() && this.valListaOpciones()){

      this.datosEncuesta.idPregunta = 0;
      this.datosEncuesta.activoCabecera = true;
      this.datosEncuesta.pregunta   = this.questionFormGroup.get('pregunta').value;
      this.datosEncuesta.textAyuda  = this.questionFormGroup.get('textoAyuda').value;
      this.datosEncuesta.tipoDato   = this.questionFormGroup.get('tipoPregunta').value;
      this.datosEncuesta.detailsQuestions =  this.listOpciones;

      //////////////////////////console.log(JSON.stringify(this.datosEncuesta));
     this.registrarEncuesta();
    }
  }

  registrarEncuesta(){
    this.mantenimientoService.registrarEncuesta(this.datosEncuesta).subscribe(resp=> {
      if (resp.valid) {
        Swal.fire({
          title: "Éxito!",
          text: resp.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });
  
        this.router.navigate(["/gnv/gestion-encuesta"]);

      } else {
        Swal.fire({
          title: "Error!",
          text: "Se generó un error al registrar la pregunta aleatoria, intente nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });

        this.router.navigate(["/gnv/gestion-encuesta"]);
      }
    });
  }

  //PARA MODIFICAR

  prepararUpdate(){
    if(this.validarFormulario() && this.valListaOpciones()){
      this.datosEncuesta.idPregunta = this.idPregunta;
      this.datosEncuesta.activoCabecera = true;
      this.datosEncuesta.pregunta   = this.questionFormGroup.get('pregunta').value;
      this.datosEncuesta.textAyuda  = this.questionFormGroup.get('textoAyuda').value;
      this.datosEncuesta.tipoDato   = this.questionFormGroup.get('tipoPregunta').value;
      this.datosEncuesta.detailsQuestions =  this.listOpciones;

      //////////////////////////console.log(JSON.stringify(this.datosEncuesta));

    this.modificarEncuesta();
    }
  }

  modificarEncuesta(){
    this.mantenimientoService.modificarEncuesta(this.datosEncuesta).subscribe(resp=> {
      if (resp.valid) {
        Swal.fire({
          title: "Éxito!",
          text: resp.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });
  
        this.router.navigate(["/gnv/gestion-encuesta"]);

      } else {
        Swal.fire({
          title: "Error!",
          text: "Se generó un error al modificar la pregunta aleatoria, intente nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });

        this.router.navigate(["/gnv/gestion-encuesta"]);
      }
    });
    
  }

}
