import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-consulta-datos',
  templateUrl: './consulta-datos.component.html',
  styleUrls: ['./consulta-datos.component.scss']
})
export class ConsultaDatosComponent implements OnInit {

  formFiltro : FormGroup;  
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.crearForm();
  }

  crearForm(){
    this.formFiltro = this.formBuilder.group({
      numCredito: ['']
    })
  }
  
  filtrar(){

  }

}
