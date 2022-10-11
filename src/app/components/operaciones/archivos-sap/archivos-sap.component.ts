import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-archivos-sap',
  templateUrl: './archivos-sap.component.html',
  styleUrls: ['./archivos-sap.component.scss']
})
export class ArchivosSAPComponent implements OnInit {

    exportActive: boolean = false;
    formFiltroFechas:FormGroup;
    datosUsuario:AuthorizeModel;
  
  constructor(
      private formBuilder:FormBuilder,
      private authorizesService:AuthorizesService,
      private dashboardService:DashboardService,
  ) { }

  ngOnInit(): void {
      this.obtnerDatosUSerLogeado();
  }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    // ////////////////////console.log(this.datosUsuario)
    this.formularioDatosFechas(this.datosUsuario.id);

  }
  
  formularioDatosFechas(idUsuario:number){

    var fecha = new Date(); //Fecha actual
    var mes = (fecha.getMonth()+1).toString(); //obteniendo mes
    var dia = fecha.getDate().toString(); //obteniendo dia
    var año = fecha.getFullYear(); //obteniendo año

      if (parseInt(dia)<10) {
        dia='0'+dia; //agrega cero si el menor de 10
      }
      if (parseInt(mes)<10) {
        mes='0'+mes //agrega cero si el menor de 10
      }
    ////////////console.log(año+"-"+mes+"-"+dia)

    this.formFiltroFechas =  this.formBuilder.group({
      fechaInicio: [año+"-"+mes+"-"+'01',Validators.required],
      fechaFin: [año+"-"+mes+"-"+dia,Validators.required],
    })


    
  }

  descargarArchivosSAP(){
    var fechaInicio=this.formFiltroFechas.get("fechaInicio").value;
    var fechaFin=this.formFiltroFechas.get("fechaFin").value;
    /* var idUsuario=this.datosUsuario.id; */
    var idUsuario=0;

    this.dashboardService.getArchivosSAP(idUsuario,fechaInicio,fechaFin).subscribe( 
      response =>{



        if (response.valid) {

          ////////////console.log(response.resultDetalle)
          ////////////console.log(response.resultDetalle['listaFinanciamientos'])
          ////////////console.log(response.resultDetalle['listaFinanciamientosAprobados'])

          this.exportDatosExcel(response.resultDetalle['listCiente'],response.resultDetalle['listVenta'])
        }


      }

    )
  }

  exportDatosExcel(ListaCliente:any,ListaVentas:any) {
    this.exportActive = true;
    const listCliente: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ListaCliente);
    const listVentas: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ListaVentas);

    const cliente: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(cliente, listCliente, 'Lista de clientes.');

    const ventas: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(ventas, listVentas, 'Lista de ventas.');

    XLSX.writeFile(cliente, 'Clientes.xlsx');
    XLSX.writeFile(ventas, 'Ventas.xlsx');
  } 

}
