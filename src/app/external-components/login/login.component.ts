import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PreevaluationDialogComponent } from '../dialog-module/preevaluation-dialog/preevaluation-dialog.component';
import { LoginRequestModel } from 'src/app/models/login/loginRequest.model'
import { LoginService } from 'src/app/services/login.service'; 
import { CommonService } from 'src/app/services/common.service'; 
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formloginGroup: FormGroup;
 
  modeloLogin: LoginRequestModel; 
  mode: string = "security";
  constructor(
        private router: Router, 
        private dialog: MatDialog,
        private loginService: LoginService,
        private commonService: CommonService,
        private formBuilder: FormBuilder,
        private authorizesService: AuthorizesService 
  ) { }

  ngOnInit(): void {
    this.openPreevaluationDialog();
    this.createForm();
    this.gotoTop();
  }

  gotoTop() {
    const element = document.querySelector('#divLogin');
    element.scrollIntoView();
  }

  createForm(){
    this.formloginGroup = this.formBuilder.group({
      username: [, [Validators.required, Validators.email]],
      password: [, [Validators.required]]
    })
  }

  registrarUsuario(): void {
    this.authorizesService.redirectRegistrarUsuario(); 
  }

  openPreevaluationDialog() {
    this.dialog.open(PreevaluationDialogComponent, { 
      width: '550px',
      autoFocus: false,
      panelClass: 'dialog-custom-4',
      hasBackdrop: true }); 
  } 

  singIn(form: NgForm) {   
    if (this.formloginGroup.valid) {
      let data: LoginRequestModel = {
        credential: this.formloginGroup.get("username").value,
        password: this.formloginGroup.get("password").value
      };  
      this.loginService.authenticateUser(data).subscribe(response => {
        // //////////////////////////console.log("DATA SINGIN: "+JSON.stringify(response))
        if (response.estado==undefined) {
          this.authorizesService.grabarToken(response.tk);
        /* this.authorizesService.redirectHome();  */
        this.authorizesService.redirectDashboard(); 
        }else if (response.estado==false) {
          let errors = [];
          errors.push(response.message+"."); 
          this.commonService.getErrorHtmlList(errors);
        }
        
      }); 
    } 
    else {
      this.getErrors(this.formloginGroup);
    } 
  }

  getErrors(formGroup: FormGroup) {
    let errors = []; 
    if (formGroup.get('username').hasError('required')) errors.push('Debe ingresar un correo válido.');  
    else if (formGroup.get('username').hasError('email')) errors.push('Debe ingresar un correo válido.');  
    else if (formGroup.get('password').hasError('required')) errors.push('Debe ingresar su contraseña.'); 
    this.commonService.getErrorHtmlList(errors); 
  }
}
