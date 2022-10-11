import { Injectable } from '@angular/core';
import { CorreoModel } from '../models/correo/correo.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from './common.service';
import { CorreoService } from './correo.service';
import { environment } from 'src/environments/environment'; 



@Injectable({
  providedIn: 'root'
})
export class CorreoPlantillaService { 
  constructor(
      private httpClient: HttpClient,
      private correoService:CorreoService,
      private commonService:CommonService
      ) { }

      messageSucces = [];
      correoModel:CorreoModel;
      urlGNV=environment.urlPG; 


      enviarCorreoCreacionUsuario(NombreApellido:string,usuario:string,contraseña:string,correo:string){
        //document.getElementById("theHtmlString")
        // //////////////////////////console.log(document.getElementById("theHtmlString").outerHTML);
        this.messageSucces=[];
        var template = '<!doctype html>'+
        '<html lang="es-PE">'+
        ''+
        '<head>'+
        '    <meta charset="utf-8">'+
        '    <title>Portal GNV</title>'+
        '    <base href="/">'+
        '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'+
        '    <link rel="icon" type="image/x-icon" href="favicon.ico">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css"> -->'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/image-magnifier-js/image-magnifier.css"> -->'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Recursive:wght@300&display=swap" rel="stylesheet">'+
        '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />'+
        '    <!-- Icons -->'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/nucleo/css/nucleo.css" type="text/css"> -->'+
        '    <link rel="stylesheet" href="assets/vendor/nucleo/css/nucleo.css" type="text/css">'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css"> -->'+
        ''+
        '    <link rel="stylesheet" href="assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css">'+
        ''+
        '    <!-- Argon CSS -->'+
        '    <link rel="stylesheet" href="assets/css/argon_style.css" type="text/css">'+
        '    <!-- <link rel="stylesheet" href="assets/assets/css/argon.css?v=1.2.0" type="text/css"> -->'+
        ''+
        '    <!-- <script src="./env.js"></script> -->'+
        '    <script async src="https://www.googletagmanager.com/gtag/js?id=G-738LP822LY"></script>'+
        ''+
        '    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">'+
        '    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>'+
        '    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>'+
        '</head>'+
        ''+
        '<style>'+
        ''+
        ''+
        '.cardServ {'+
        '    background: #FFFFFF !important;'+
        '    box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '    border-radius: 10px !important;'+
        '    width: 100%;'+
        '    padding: 20px 10px;'+
        '    text-align: center;'+
        '    transition: all 0.3s ease-in-out;'+
        '}'+
        ''+
        '.cardServ:hover {'+
        '    -webkit-transform: translateY(-5px);'+
        '    transform: translateY(-5px);'+
        '    cursor: pointer;'+
        '}'+
        ''+
        '.circleIcon {'+
        '    background: #00A1DE;'+
        '    border-radius: 50%;'+
        '    -moz-border-radius: 50%;'+
        '    -webkit-border-radius: 50%;'+
        '    display: inline-block;'+
        '    line-height: 80px;'+
        '    margin-right: 15px;'+
        '    text-align: center;'+
        '    width: 80px;'+
        '}'+
        ''+
        '.circleIcon img {'+
        '    width: 35px;'+
        '}'+
        ''+
        '.textProd {'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    line-height: 19px;'+
        '    color: #868685;'+
        '}'+
        ''+
        '.textFooter{'+
        '    font-size: 12px;'+
        '    line-height: 16px;'+
        '    color: #8492A6;'+
        '}'+
        '.textTitle{'+
        '    font-weight: 600;'+
        '    font-size: 24px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textSubtitle{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '    text-decoration: none;'+
        '}'+
        '.textParrBlack{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #868685;'+
        ''+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        ''+
        '        .cardTop {'+
        '            top: -42px;'+
        '            z-index: 0 !important;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '            border-radius: 10px !important;'+
        '        }'+
        '        '+
        '        .cardInterna {'+
        '            background: #FFFFFF;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706);'+
        '            border-radius: 10px;'+
        '        }'+
        '        '+
        '        .form-row {'+
        '  display: -ms-flexbox;'+
        '  display: flex;'+
        '  -ms-flex-wrap: wrap;'+
        '  flex-wrap: wrap;'+
        '  margin-right: -5px;'+
        '  margin-left: -5px;'+
        '}'+
        ''+
        '.form-row > .col,'+
        '.form-row > [class*="col-"] {'+
        '  padding-right: 5px;'+
        '  padding-left: 5px;'+
        '}'+
        ''+
        '</style>'+
        ''+
        '<body class="mat-typography">'+
        '    <div>'+
        '        <section>'+
        '            <div class="container mt-5" >'+
        '            '+
        '                <div class="row">'+
        '                    <div class="col-12">'+
        '                        <mat-card class="cardTop">'+
        '                            <div class="row">'+
        '                                <img src="https://www.calidda.com.pe/ImagenesLink/topImg.jpg" width="100%">'+
        '                            </div>'+
        '                            <div class="row pt-5 pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textTitle">¡Bienvenid@, NOMBREYAPELLIDO!</p>'+
        '                                    <span class="textSubtitle"> Gracias por registrarte al portal GNV</span>'+
        '                                </div>'+
        ''+
        '                                <div class="form-row pt-3 pl-4 pr-4" style="height: 35px;">'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12" style="width: 20%;">'+
        '                                        <p class="textParrBlack">Usuario:</p>'+
        '                                    </div>'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">'+
        '                                        <p class="textParr"> USERNAME </p>'+
        '                                    </div>'+
        '                                </div>'+
        ''+
        '                                <div class="form-row" style="height: 35px;">'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12" style="width: 20%;">'+
        '                                        <p class="textParrBlack">Contraseña:</p>'+
        '                                    </div>'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">'+
        '                                        <p class="textParr"> PASSWORD </p>'+
        '                                    </div>'+
        '                                </div>'+
        ''+
        ''+
        ''+
        '                            </div>'+
        ''+
        '                            <div class="row mt-4 mb-4 pl-4 pr-4">'+
        ''+
        '                                <a class="textParr" href="RUTAURL" target="_blank">Ingresar</a>'+
        ''+
        '                            </div>'+
        '                            '+
        '                            <hr>'+
        '                            <div class="row pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textFooter">GNV Calidda. Todos los derechos reservados</p>'+
        '                                </div>'+
        '                            </div>'+
        '                        </mat-card>'+
        '                    </div>'+
        '                </div>'+
        '            </div>'+
        '        </section>'+
        '    </div>'+
        '</body>'+
        '<script>'+
        '    window.dataLayer = window.dataLayer || [];'+
        ''+
        '    function gtag() {'+
        '        dataLayer.push(arguments);'+
        '    }'+
        '    gtag(\'js\', new Date());'+
        ''+
        '    gtag(\'config\', \'G-738LP822LY\');'+
        '</script>'+
        ''+
        '<!-- Optional JavaScript; choose one of the two! -->'+
        ''+
        '    <!-- Option 1: Bootstrap Bundle with Popper -->'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'+
        ''+
        '    <!-- Option 2: Separate Popper and Bootstrap JS -->'+
        '    <!--'+
        '    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>'+
        '    -->'+
        '    '+
        ''+
        '</html>';
          
        
    
    
        template=template.replace("NOMBREYAPELLIDO",NombreApellido)
        template=template.replace("USERNAME",usuario)
        template=template.replace("PASSWORD",contraseña)
        template=template.replace("RUTAURL",this.urlGNV)
        this.correoModel={
    
          listRecipients:[correo],
          subject:"Registro Cliente",
          body:template
        }
    
        this.correoService.postEnviarCorreo(this.correoModel).subscribe(resp=>{
    
          if (resp.valid) {
            // this.messageSucces.push(resp.message)

          }else{
            let errors = [];
            // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
            errors.push(resp.message);
            this.commonService.getErrorHtmlList(errors); 
          }
        })
    
    
      }

      enviarCorreoPreevaluacion(NombreApellido:string,producto:string,proveedor:string,precio:string,correo:string[]){
        //document.getElementById("theHtmlString")
        // //////////////////////////console.log(document.getElementById("theHtmlString").outerHTML);
    
        this.messageSucces=[];
        
        var template = '<!doctype html>'+
        '<html lang="es-PE">'+
        ''+
        '<head>'+
        '    <meta charset="utf-8">'+
        '    <title>Portal GNV</title>'+
        '    <base href="/">'+
        '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'+
        '    <link rel="icon" type="image/x-icon" href="favicon.ico">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css"> -->'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/image-magnifier-js/image-magnifier.css"> -->'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Recursive:wght@300&display=swap" rel="stylesheet">'+
        '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />'+
        '    <!-- Icons -->'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/nucleo/css/nucleo.css" type="text/css"> -->'+
        '    <link rel="stylesheet" href="assets/vendor/nucleo/css/nucleo.css" type="text/css">'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css"> -->'+
        ''+
        '    <link rel="stylesheet" href="assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css">'+
        ''+
        '    <!-- Argon CSS -->'+
        '    <link rel="stylesheet" href="assets/css/argon_style.css" type="text/css">'+
        '    <!-- <link rel="stylesheet" href="assets/assets/css/argon.css?v=1.2.0" type="text/css"> -->'+
        ''+
        '    <!-- <script src="./env.js"></script> -->'+
        '    <script async src="https://www.googletagmanager.com/gtag/js?id=G-738LP822LY"></script>'+
        ''+
        '    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">'+
        '    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>'+
        '    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>'+
        '</head>'+
        ''+
        '<style>'+
        ''+
        ''+
        '.cardServ {'+
        '    background: #FFFFFF !important;'+
        '    box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '    border-radius: 10px !important;'+
        '    width: 100%;'+
        '    padding: 20px 10px;'+
        '    text-align: center;'+
        '    transition: all 0.3s ease-in-out;'+
        '}'+
        ''+
        '.cardServ:hover {'+
        '    -webkit-transform: translateY(-5px);'+
        '    transform: translateY(-5px);'+
        '    cursor: pointer;'+
        '}'+
        ''+
        '.circleIcon {'+
        '    background: #00A1DE;'+
        '    border-radius: 50%;'+
        '    -moz-border-radius: 50%;'+
        '    -webkit-border-radius: 50%;'+
        '    display: inline-block;'+
        '    line-height: 80px;'+
        '    margin-right: 15px;'+
        '    text-align: center;'+
        '    width: 80px;'+
        '}'+
        ''+
        '.circleIcon img {'+
        '    width: 35px;'+
        '}'+
        ''+
        '.textProd {'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    line-height: 19px;'+
        '    color: #868685;'+
        '}'+
        ''+
        '.textFooter{'+
        '    font-size: 12px;'+
        '    line-height: 16px;'+
        '    color: #8492A6;'+
        '}'+
        '.textTitle{'+
        '    font-weight: 600;'+
        '    font-size: 24px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textSubtitle{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '    text-decoration: none;'+
        '}'+
        '.textParrBlack{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #868685;'+
        ''+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        ''+
        '        .cardTop {'+
        '            top: -42px;'+
        '            z-index: 0 !important;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '            border-radius: 10px !important;'+
        '        }'+
        '        '+
        '        .cardInterna {'+
        '            background: #FFFFFF;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706);'+
        '            border-radius: 10px;'+
        '        }'+
        '        '+
        '        .form-row {'+
        '  display: -ms-flexbox;'+
        '  display: flex;'+
        '  -ms-flex-wrap: wrap;'+
        '  flex-wrap: wrap;'+
        '  margin-right: -5px;'+
        '  margin-left: -5px;'+
        '}'+
        ''+
        '.form-row > .col,'+
        '.form-row > [class*="col-"] {'+
        '  padding-right: 5px;'+
        '  padding-left: 5px;'+
        '}'+
        ''+
        '</style>'+
        ''+
        '<body class="mat-typography">'+
        '    <div>'+
        '        <section>'+
        '            <div class="container mt-5" >'+
        '            '+
        '                <div class="row">'+
        '                    <div class="col-12">'+
        '                        <mat-card class="cardTop">'+
        '                            <div class="row">'+
        '                                <img src="https://www.calidda.com.pe/ImagenesLink/topImg.jpg" width="100%">'+
        '                            </div>'+
        '                            <div class="row pt-5 pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textTitle">¡Bienvenid@, NOMBREYAPELLIDO!</p>'+
        '                                    <span class="textSubtitle"> Gracias por registrarte en una pre-evaluación</span>'+
        '                                </div>'+
        ''+
        '                                <div class="form-row pt-3 pl-4 pr-4" style="height: 35px;">'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12" style="width: 30%;">'+
        '                                        <p class="textParrBlack">Producto a financiar:</p>'+
        '                                    </div>'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">'+
        '                                        <p class="textParr"> PRODUCTOFINANCIAR </p>'+
        '                                    </div>'+
        '                                </div>'+
        ''+
        '                                <div class="form-row" style="height: 35px;">'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12" style="width: 30%;">'+
        '                                        <p class="textParrBlack">Proveedor:</p>'+
        '                                    </div>'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">'+
        '                                        <p class="textParr"> PROVEEDOR </p>'+
        '                                    </div>'+
        '                                </div>'+
        ''+
        '                                <div class="form-row" style="height: 60px;">'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12" style="width: 30%;">'+
        '                                        <p class="textParrBlack">Precio:</p>'+
        '                                    </div>'+
        '                                    <div class="form-group col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">'+
        '                                        <p class="textParr"> PRECIO </p>'+
        '                                    </div>'+
        '                                </div>'+
        ''+
        ''+
        '                            </div>'+
        ''+
        '                            <div class="row mt-4 mb-4 pl-4 pr-4">'+
        ''+
        '                                <a class="textParr" href="RUTAURL" target="_blank">Ingresar</a>'+
        ''+
        '                            </div>'+
        '                            '+
        '                            <hr>'+
        '                            <div class="row pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textFooter">GNV Calidda. Todos los derechos reservados</p>'+
        '                                </div>'+
        '                            </div>'+
        '                        </mat-card>'+
        '                    </div>'+
        '                </div>'+
        '            </div>'+
        '        </section>'+
        '    </div>'+
        '</body>'+
        '<script>'+
        '    window.dataLayer = window.dataLayer || [];'+
        ''+
        '    function gtag() {'+
        '        dataLayer.push(arguments);'+
        '    }'+
        '    gtag(\'js\', new Date());'+
        ''+
        '    gtag(\'config\', \'G-738LP822LY\');'+
        '</script>'+
        ''+
        '<!-- Optional JavaScript; choose one of the two! -->'+
        ''+
        '    <!-- Option 1: Bootstrap Bundle with Popper -->'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'+
        ''+
        '    <!-- Option 2: Separate Popper and Bootstrap JS -->'+
        '    <!--'+
        '    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>'+
        '    -->'+
        '    '+
        ''+
        '</html>';
          
        
          
        
          
        
          
       
        const formatterSoles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
        
        template=template.replace("NOMBREYAPELLIDO",NombreApellido)
        template=template.replace("PRODUCTOFINANCIAR",producto)
        template=template.replace("PROVEEDOR",proveedor)
        template=template.replace("PRECIO",formatterSoles.format(parseInt(precio)).toString())
        template=template.replace("RUTAURL",this.urlGNV)
    
        this.correoModel={
    
          listRecipients:correo,
          subject:"Registro de Pre-evaluación",
          // body:document.getElementById("theHtmlString").outerHTML.toString(),
          body:template
        }
    
        // //////////////////////////console.log(document.getElementById("theHtmlString").innerHTML.toString())
        // //////////////////////////console.log("DATA ENVIO CORREO: "+JSON.stringify(this.correoModel))
    
        this.correoService.postEnviarCorreo(this.correoModel).subscribe(resp=>{
    
          if (resp.valid) {
            // this.commonService.getSuccessHtmlList(this.messageSucces,'');
          }else {
            let errors = [];
            // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
            errors.push(resp.message);
            this.commonService.getErrorHtmlList(errors);
          }
    
        })
      }

      enviarCorreoRegistro(NombreApellido:string,correo:string[],mensaje:string,asunto:string,rutaRedirigir:string){
        //document.getElementById("theHtmlString")
        // //////////////////////////console.log(document.getElementById("theHtmlString").outerHTML);
    
        this.messageSucces=[];
        
        var template = '<!doctype html>'+
        '<html lang="es-PE">'+
        ''+
        '<head>'+
        '    <meta charset="utf-8">'+
        '    <title>Portal GNV</title>'+
        '    <base href="/">'+
        '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'+
        '    <link rel="icon" type="image/x-icon" href="favicon.ico">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css"> -->'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/image-magnifier-js/image-magnifier.css"> -->'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Recursive:wght@300&display=swap" rel="stylesheet">'+
        '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />'+
        '    <!-- Icons -->'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/nucleo/css/nucleo.css" type="text/css"> -->'+
        '    <link rel="stylesheet" href="assets/vendor/nucleo/css/nucleo.css" type="text/css">'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css"> -->'+
        ''+
        '    <link rel="stylesheet" href="assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css">'+
        ''+
        '    <!-- Argon CSS -->'+
        '    <link rel="stylesheet" href="assets/css/argon_style.css" type="text/css">'+
        '    <!-- <link rel="stylesheet" href="assets/assets/css/argon.css?v=1.2.0" type="text/css"> -->'+
        ''+
        '    <!-- <script src="./env.js"></script> -->'+
        '    <script async src="https://www.googletagmanager.com/gtag/js?id=G-738LP822LY"></script>'+
        ''+
        '    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">'+
        '    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>'+
        '    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>'+
        '</head>'+
        ''+
        '<style>'+
        ''+
        ''+
        '.cardServ {'+
        '    background: #FFFFFF !important;'+
        '    box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '    border-radius: 10px !important;'+
        '    width: 100%;'+
        '    padding: 20px 10px;'+
        '    text-align: center;'+
        '    transition: all 0.3s ease-in-out;'+
        '}'+
        ''+
        '.cardServ:hover {'+
        '    -webkit-transform: translateY(-5px);'+
        '    transform: translateY(-5px);'+
        '    cursor: pointer;'+
        '}'+
        ''+
        '.circleIcon {'+
        '    background: #00A1DE;'+
        '    border-radius: 50%;'+
        '    -moz-border-radius: 50%;'+
        '    -webkit-border-radius: 50%;'+
        '    display: inline-block;'+
        '    line-height: 80px;'+
        '    margin-right: 15px;'+
        '    text-align: center;'+
        '    width: 80px;'+
        '}'+
        ''+
        '.circleIcon img {'+
        '    width: 35px;'+
        '}'+
        ''+
        '.textProd {'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    line-height: 19px;'+
        '    color: #868685;'+
        '}'+
        ''+
        '.textFooter{'+
        '    font-size: 12px;'+
        '    line-height: 16px;'+
        '    color: #8492A6;'+
        '}'+
        '.textTitle{'+
        '    font-weight: 600;'+
        '    font-size: 24px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textSubtitle{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '    text-decoration: none;'+
        '}'+
        '.textParrBlack{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #868685;'+
        ''+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        ''+
        '        .cardTop {'+
        '            top: -42px;'+
        '            z-index: 0 !important;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '            border-radius: 10px !important;'+
        '        }'+
        '        '+
        '        .cardInterna {'+
        '            background: #FFFFFF;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706);'+
        '            border-radius: 10px;'+
        '        }'+
        '        '+
        '        .form-row {'+
        '  display: -ms-flexbox;'+
        '  display: flex;'+
        '  -ms-flex-wrap: wrap;'+
        '  flex-wrap: wrap;'+
        '  margin-right: -5px;'+
        '  margin-left: -5px;'+
        '}'+
        ''+
        '.form-row > .col,'+
        '.form-row > [class*="col-"] {'+
        '  padding-right: 5px;'+
        '  padding-left: 5px;'+
        '}'+
        ''+
        '</style>'+
        ''+
        '<body class="mat-typography">'+
        '    <div>'+
        '        <section>'+
        '            <div class="container mt-5" >'+
        '            '+
        '                <div class="row">'+
        '                    <div class="col-12">'+
        '                        <mat-card class="cardTop">'+
        '                            <div class="row">'+
        '                                <img src="https://www.calidda.com.pe/ImagenesLink/topImg.jpg" width="100%">'+
        '                            </div>'+
        '                            <div class="row pt-5 pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textTitle">¡Estimad@, NOMBREYAPELLIDO!</p>'+
        '                                    <span class="textSubtitle"> MENSAJE </span>'+
        '                                </div>'+
        '                            </div>'+
        ''+
        '                            <div class="row mt-4 mb-4 pl-4 pr-4">'+
        ''+
        '                                <a class="textParr" href="RUTAURL" target="_blank">Ingresar</a>'+
        ''+
        '                            </div>'+
        '                            '+
        '                            <hr>'+
        '                            <div class="row pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textFooter">GNV Calidda. Todos los derechos reservados</p>'+
        '                                </div>'+
        '                            </div>'+
        '                        </mat-card>'+
        '                    </div>'+
        '                </div>'+
        '            </div>'+
        '        </section>'+
        '    </div>'+
        '</body>'+
        '<script>'+
        '    window.dataLayer = window.dataLayer || [];'+
        ''+
        '    function gtag() {'+
        '        dataLayer.push(arguments);'+
        '    }'+
        '    gtag(\'js\', new Date());'+
        ''+
        '    gtag(\'config\', \'G-738LP822LY\');'+
        '</script>'+
        ''+
        '<!-- Optional JavaScript; choose one of the two! -->'+
        ''+
        '    <!-- Option 1: Bootstrap Bundle with Popper -->'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'+
        ''+
        '    <!-- Option 2: Separate Popper and Bootstrap JS -->'+
        '    <!--'+
        '    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>'+
        '    -->'+
        '    '+
        ''+
        '</html>';
        
        template=template.replace("NOMBREYAPELLIDO",NombreApellido)
        template=template.replace("RUTAURL",this.urlGNV)
        template=template.replace("MENSAJE",mensaje)
    
        this.correoModel={
    
          listRecipients:correo,
          subject:asunto,
          // body:document.getElementById("theHtmlString").outerHTML.toString(),
          body:template
        }
    
        // //////////////////////////console.log(document.getElementById("theHtmlString").innerHTML.toString())
        // //////////////////////////console.log("DATA ENVIO CORREO: "+JSON.stringify(this.correoModel))
    
        this.correoService.postEnviarCorreo(this.correoModel).subscribe(resp=>{
    
          //////////////////console.log(resp)
          if (resp.valid) {
            this.messageSucces.push("Se ha procesado la información y se enviaron los resultados por correo.")
            this.commonService.getSuccessHtmlList(this.messageSucces,rutaRedirigir);
          }else {
            let errors = [];
            // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
            errors.push(resp.message);
            this.commonService.getErrorHtmlList(errors);
          }
    
        })
      }

      enviarCorreoAlertaAsesor(NombreApellido:string,correo:string[],mensaje:string,asunto:string,rutaRedirigir:string){
        //document.getElementById("theHtmlString")
        // //////////////////////////console.log(document.getElementById("theHtmlString").outerHTML);
    
        this.messageSucces=[];
        
        var template = '<!doctype html>'+
        '<html lang="es-PE">'+
        ''+
        '<head>'+
        '    <meta charset="utf-8">'+
        '    <title>Portal GNV</title>'+
        '    <base href="/">'+
        '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'+
        '    <link rel="icon" type="image/x-icon" href="favicon.ico">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css"> -->'+
        '    <!-- <link rel="stylesheet" href="assets/vendor/image-magnifier-js/image-magnifier.css"> -->'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">'+
        '    <link href="https://fonts.googleapis.com/css2?family=Recursive:wght@300&display=swap" rel="stylesheet">'+
        '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />'+
        '    <!-- Icons -->'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/nucleo/css/nucleo.css" type="text/css"> -->'+
        '    <link rel="stylesheet" href="assets/vendor/nucleo/css/nucleo.css" type="text/css">'+
        ''+
        '    <!-- <link rel="stylesheet" href="assets/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css"> -->'+
        ''+
        '    <link rel="stylesheet" href="assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" type="text/css">'+
        ''+
        '    <!-- Argon CSS -->'+
        '    <link rel="stylesheet" href="assets/css/argon_style.css" type="text/css">'+
        '    <!-- <link rel="stylesheet" href="assets/assets/css/argon.css?v=1.2.0" type="text/css"> -->'+
        ''+
        '    <!-- <script src="./env.js"></script> -->'+
        '    <script async src="https://www.googletagmanager.com/gtag/js?id=G-738LP822LY"></script>'+
        ''+
        '    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">'+
        '    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>'+
        '    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>'+
        '</head>'+
        ''+
        '<style>'+
        ''+
        ''+
        '.cardServ {'+
        '    background: #FFFFFF !important;'+
        '    box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '    border-radius: 10px !important;'+
        '    width: 100%;'+
        '    padding: 20px 10px;'+
        '    text-align: center;'+
        '    transition: all 0.3s ease-in-out;'+
        '}'+
        ''+
        '.cardServ:hover {'+
        '    -webkit-transform: translateY(-5px);'+
        '    transform: translateY(-5px);'+
        '    cursor: pointer;'+
        '}'+
        ''+
        '.circleIcon {'+
        '    background: #00A1DE;'+
        '    border-radius: 50%;'+
        '    -moz-border-radius: 50%;'+
        '    -webkit-border-radius: 50%;'+
        '    display: inline-block;'+
        '    line-height: 80px;'+
        '    margin-right: 15px;'+
        '    text-align: center;'+
        '    width: 80px;'+
        '}'+
        ''+
        '.circleIcon img {'+
        '    width: 35px;'+
        '}'+
        ''+
        '.textProd {'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    line-height: 19px;'+
        '    color: #868685;'+
        '}'+
        ''+
        '.textFooter{'+
        '    font-size: 12px;'+
        '    line-height: 16px;'+
        '    color: #8492A6;'+
        '}'+
        '.textTitle{'+
        '    font-weight: 600;'+
        '    font-size: 24px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textSubtitle{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '    text-decoration: none;'+
        '}'+
        '.textParrBlack{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #868685;'+
        ''+
        '}'+
        '.textParr{'+
        '    font-weight: 600;'+
        '    font-size: 16px;'+
        '    color: #00A1DE;'+
        '}'+
        ''+
        '        .cardTop {'+
        '            top: -42px;'+
        '            z-index: 0 !important;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706) !important;'+
        '            border-radius: 10px !important;'+
        '        }'+
        '        '+
        '        .cardInterna {'+
        '            background: #FFFFFF;'+
        '            box-shadow: 0px 3px 12px rgba(114, 124, 142, 0.196706);'+
        '            border-radius: 10px;'+
        '        }'+
        '        '+
        '        .form-row {'+
        '  display: -ms-flexbox;'+
        '  display: flex;'+
        '  -ms-flex-wrap: wrap;'+
        '  flex-wrap: wrap;'+
        '  margin-right: -5px;'+
        '  margin-left: -5px;'+
        '}'+
        ''+
        '.form-row > .col,'+
        '.form-row > [class*="col-"] {'+
        '  padding-right: 5px;'+
        '  padding-left: 5px;'+
        '}'+
        ''+
        '</style>'+
        ''+
        '<body class="mat-typography">'+
        '    <div>'+
        '        <section>'+
        '            <div class="container mt-5" >'+
        '            '+
        '                <div class="row">'+
        '                    <div class="col-12">'+
        '                        <mat-card class="cardTop">'+
        '                            <div class="row">'+
        '                                <img src="https://www.calidda.com.pe/ImagenesLink/topImg.jpg" width="100%">'+
        '                            </div>'+
        '                            <div class="row pt-5 pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textTitle">¡Estimad@, NOMBREYAPELLIDO!</p>'+
        '                                    <span class="textSubtitle"> MENSAJE </span>'+
        '                                </div>'+
        '                            </div>'+
        ''+
        '                            <div class="row mt-4 mb-4 pl-4 pr-4">'+
        ''+
        '                                <a class="textParr" href="RUTAURL" target="_blank">Ingresar</a>'+
        ''+
        '                            </div>'+
        '                            '+
        '                            <hr>'+
        '                            <div class="row pl-4 pr-4">'+
        '                                <div class="col-12">'+
        '                                    <p class="textFooter">GNV Calidda. Todos los derechos reservados</p>'+
        '                                </div>'+
        '                            </div>'+
        '                        </mat-card>'+
        '                    </div>'+
        '                </div>'+
        '            </div>'+
        '        </section>'+
        '    </div>'+
        '</body>'+
        '<script>'+
        '    window.dataLayer = window.dataLayer || [];'+
        ''+
        '    function gtag() {'+
        '        dataLayer.push(arguments);'+
        '    }'+
        '    gtag(\'js\', new Date());'+
        ''+
        '    gtag(\'config\', \'G-738LP822LY\');'+
        '</script>'+
        ''+
        '<!-- Optional JavaScript; choose one of the two! -->'+
        ''+
        '    <!-- Option 1: Bootstrap Bundle with Popper -->'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'+
        ''+
        '    <!-- Option 2: Separate Popper and Bootstrap JS -->'+
        '    <!--'+
        '    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>'+
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>'+
        '    -->'+
        '    '+
        ''+
        '</html>';
        
        template=template.replace("NOMBREYAPELLIDO",NombreApellido)
        template=template.replace("RUTAURL",this.urlGNV)
        template=template.replace("MENSAJE",mensaje)
    
        this.correoModel={
    
          listRecipients:correo,
          subject:asunto,
          // body:document.getElementById("theHtmlString").outerHTML.toString(),
          body:template
        }
    
        // //////////////////////////console.log(document.getElementById("theHtmlString").innerHTML.toString())
        // //////////////////////////console.log("DATA ENVIO CORREO: "+JSON.stringify(this.correoModel))
    
        this.correoService.postEnviarCorreo(this.correoModel).subscribe(resp=>{
    
          //////////////////console.log(resp)
          if (resp.valid) {
            this.messageSucces.push("Se ha enviado la alerta por email al asesor. ")
            this.commonService.getSuccessHtmlList(this.messageSucces,rutaRedirigir);
          }else {
            let errors = [];
            // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
            errors.push(resp.message);
            this.commonService.getErrorHtmlList(errors);
          }
    
        })
      }
 
}
