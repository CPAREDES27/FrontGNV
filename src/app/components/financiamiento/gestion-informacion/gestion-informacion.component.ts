import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion-informacion',
  templateUrl: './gestion-informacion.component.html',
  styleUrls: ['./gestion-informacion.component.scss']
})
export class GestionInformacionComponent implements OnInit {

  formFiltro : FormGroup;  


  constructor(
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {

    this.crearForm();
  }

  crearForm(){
    this.formFiltro = this.formBuilder.group({
      numPlaca: ['']
    })
  }
  
  filtrar(){

  }
}
