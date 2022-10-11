import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListAsesoresModel } from 'src/app/models/listas/listAsesores.model';
import { CommonService } from 'src/app/services/common.service';
import { ListSelectService } from 'src/app/services/list-select.service';




@Component({
  selector: 'app-modal-adjuntar',
  templateUrl: './modal-agregar-asesor.component.html',
  styleUrls: ['./modal-agregar-asesor.component.scss']
})
export class ModalAgregarAsesorComponent implements OnInit {

 
  listaAsesores : ListAsesoresModel[];

  FormularioAsesor : FormGroup;  
  messageSuccess = [];

  constructor(
    private listSelect: ListSelectService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<ModalAgregarAsesorComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data,

  ) { }

  ngOnInit(): void {
    webPreferences: {
      webSecurity: false
    }

    //////////////console.log(this.data)

    this.listAsesores();
    this.crearFormularioAsesor();
   
  }


  crearFormularioAsesor(){
    this.FormularioAsesor =  this.formBuilder.group({

      asesorVentas: ['',Validators.required],
      // observaciones: ['',Validators.required],
      
    })
  }

  listAsesores(){
    this.listSelect.getListAsesores().subscribe(resp =>{
      //////////////////////////console.log(JSON.stringify(resp))


      var asesores=resp;
      var listaAsesores=[];
      //////////////////////////console.log("LENGHT: "+JSON.stringify(asesores).length)
      ;

      for (let i = 0; i < Object.keys(resp).length; i++) {
        ////////////console.log(resp[i].idUsuario)
        listaAsesores.push(
          {
            "idUsuario": resp[i].idUsuario,
            "nomCliente": resp[i].nomCliente+" "+resp[i].apeCliente,
            "apeCliente": resp[i].apeCliente,
            "email": resp[i].email
          }
        )


        //////////////////////////console.log(listaAsesores)

      }

      //////////////////////////console.log(listaAsesores)

      this.listaAsesores = JSON.parse(JSON.stringify(listaAsesores));

    })
  }



  aceptarAsesor(){

    var idPreevaluacion=this.data
    var idAsesor=parseInt(this.FormularioAsesor.get('asesorVentas').value);

    this.listSelect.updateAsesorPreevaluacion(idPreevaluacion,idAsesor).subscribe(response =>{

     if (response.valid) {
      this.messageSuccess.push(response.message)
      //////////////////////////console.log("RESPUESTA: "+JSON.stringify(response))
      this.commonService.getSuccessHtmlList(this.messageSuccess,'SinRuta'); 
      this.dialogRef.close(response.valid);
    } else {
      let errors = [];
      errors.push(response.message);
      this.commonService.getErrorHtmlList(errors); 
    }
    })
    
  }




}
