import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-password-recuperar',
  templateUrl: './password-recuperar.component.html',
  styleUrls: ['./password-recuperar.component.scss']
})
export class PasswordRecuperarComponent implements OnInit {
  formrecuperarGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.formrecuperarGroup = this.formBuilder.group({
      password: [, [Validators.required]]
    })
  }

  recuperarPassword(form: NgForm) {   
    if (this.formrecuperarGroup.valid) {
      //Proceso Recuperar contraseña
    }else {
      this.getErrors(this.formrecuperarGroup);
    } 
  }

  getErrors(formGroup: FormGroup) {
    let errors = []; 
    if (formGroup.get('password').hasError('required')) errors.push('Debe ingresar su contraseña.');  
    this.commonService.getErrorHtmlList(errors); 
  }

}
