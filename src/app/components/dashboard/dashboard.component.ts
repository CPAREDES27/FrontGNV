import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { json } from '@rxweb/reactive-form-validators';
import { Subject } from 'rxjs';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  datosUsuario:AuthorizeModel;
  rolId: number=0;

  formFiltroFechas:FormGroup;

  timeout: any = null;

  datosTotalFinanciamiento=[]
  datosPorcentajeVentas=[]
  financiamientoAprobados=[]

  viewAsesorVenta: any[] = [300, 200];

  exportActive: boolean = false;

  dataDashboardGeneral:any={};

  name = 'Angular';
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

  view: any[] = [550, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Asesores';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;
  doughnut = true;
  colorScheme = {
    domain: ['#00A1DE', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  //pie
  showLabels = true;
  // data goes here

  
  // options
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  cardColor: string = '#00A34B';

  // Observable for update 
  update$: Subject<any> = new Subject();

  //Grafico General Analista Comercial
  graficoGeneralAS=[];

  constructor(
    private authorizesService:AuthorizesService,
    private formBuilder: FormBuilder,
    private dashboardService:DashboardService,
  ) { 

    this.refrescar();
    

  }

  ngOnInit(): void {
    this.obtnerDatosUSerLogeado();
    
    
  }

  refrescar(){
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.datosTotalFinanciamiento=[...this.datosTotalFinanciamiento]
      this.datosPorcentajeVentas=[...this.datosPorcentajeVentas]
      this.financiamientoAprobados=[...this.financiamientoAprobados]
    }, 1000);
  }
  
  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    // ////////////////////console.log(this.datosUsuario)
    this.rolId=parseInt(this.datosUsuario.rol);
    this.formularioDatosFechas(this.rolId);

  }

  formularioDatosFechas(idAsesor:number){

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

    if (idAsesor==2) {
      this.dashboardAsesor();
    }else{
      //////////console.log("DASHBOARD GENERAL")
      this.dashboardGeneral();
      this.verGraficoGeneral();
    }
    
  }

  

  dashboardAsesor(){
    var fechaInicio=this.formFiltroFechas.get("fechaInicio").value;
    var fechaFin=this.formFiltroFechas.get("fechaFin").value;
    var idAsesor=this.datosUsuario.id;

    this.dashboardService.getDashboardAsesor(idAsesor,fechaInicio,fechaFin).subscribe( 
      response =>{
        ////////////console.log(response.resultDashboard['cantidadTotal_Financiamieno'])
        ////////////console.log(response.resultDashboard['porcentaje_Ventas'])

        this.datosTotalFinanciamiento=[]
        this.datosPorcentajeVentas=[]
        this.financiamientoAprobados=[]
        if (response.valid) {

          this.datosTotalFinanciamiento.push({
            "name": "Total financiamiento",
            "value": response.resultDashboard['cantidadTotal_Financiamieno']
          })
          this.datosPorcentajeVentas.push({
            "name": "Porcentaje de ventas",
            "value": response.resultDashboard['porcentaje_Ventas']+"%"
          })
          this.financiamientoAprobados.push({
            "name": "Financiamientos aprobados",
            "value": response.resultDashboard['financiamientos_Aprobados']
          })

        }

        this.updateChart();

        this.refrescar();
        ////////////console.log(this.datosTotalFinanciamiento)
        ////////////console.log(this.datosPorcentajeVentas)

      }

    )
  }

  updateChart(){
    this.update$.next(true);
  }

  onSelect(event){
    
  }

  dashboardDetalleAsesor(){
    var fechaInicio=this.formFiltroFechas.get("fechaInicio").value;
    var fechaFin=this.formFiltroFechas.get("fechaFin").value;
    var idAsesor=this.datosUsuario.id;

    this.dashboardService.getDashboardDetalleAsesor(idAsesor,fechaInicio,fechaFin).subscribe( 
      response =>{



        if (response.valid) {

          ////////////console.log(response.resultDetalle)
          ////////////console.log(response.resultDetalle['listaFinanciamientos'])
          ////////////console.log(response.resultDetalle['listaFinanciamientosAprobados'])

          this.exportDetalleAsesor(response.resultDetalle['listaFinanciamientos'],response.resultDetalle['listaFinanciamientosAprobados'])
        }


      }

    )
  }

  exportDetalleAsesor(ListaFinanciamiento:any,ListaFinanciamientosAprobados:any) {
    this.exportActive = true;
    const listFinanciamiento: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ListaFinanciamiento);
    const listFinanciamientosAprobados: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ListaFinanciamientosAprobados);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, listFinanciamiento, 'Lista de financiamientos');
    XLSX.utils.book_append_sheet(wb, listFinanciamientosAprobados, 'Financiamientos aprobados');

    XLSX.writeFile(wb, 'ReporteFinanciamiento.xlsx');
  } 

  //PARA DASHBOARD GENERAL 

  dashboardGeneral(){
    
    var fechaInicio=this.formFiltroFechas.get("fechaInicio").value;
    var fechaFin=this.formFiltroFechas.get("fechaFin").value;
    var idAsesor=0;

    this.dataDashboardGeneral={}

    this.dashboardService.getDashboardGeneral(idAsesor,fechaInicio,fechaFin).subscribe( 
      response =>{
        ////////////console.log(response.resultDashboard['cantidadTotal_Financiamieno'])
        ////////////console.log(response.resultDashboard['porcentaje_Ventas'])
        ////console.log(response)
        if (response.valid) {

          this.dataDashboardGeneral={
            "productos_vendidos":response.resultDashboard['productos_vendidos'],
            "cantidadTotal_Financiamiento":response.resultDashboard['cantidadTotal_Financiamiento'],
            "porcentaje_Ventas":response.resultDashboard['porcentaje_Ventas'],
            "montoTotal_Financiado":response.resultDashboard['montoTotal_Financiado'],
          }

          //////////console.log(this.dataDashboardGeneral)
        }

        this.updateChart();


        ////////////console.log(this.datosTotalFinanciamiento)
        ////////////console.log(this.datosPorcentajeVentas)

      }

    )
  }


  dashboardGeneralDetalle(){
    var fechaInicio=this.formFiltroFechas.get("fechaInicio").value;
    var fechaFin=this.formFiltroFechas.get("fechaFin").value;
    var idAsesor=0;

    this.dashboardService.getDashboardGeneralDetalle(idAsesor,fechaInicio,fechaFin).subscribe( 
      response =>{



        if (response.valid) {

          ////////////console.log(response.resultDetalle)
          ////////////console.log(response.resultDetalle['listaFinanciamientos'])
          ////////////console.log(response.resultDetalle['listaFinanciamientosAprobados'])

          this.exportGeneralDetalle(response.resultDetalle['listaFinanciamientos'],response.resultDetalle['listaFinanciamientosAprobados'])
        }


      }

    )
  }

  exportGeneralDetalle(ListaFinanciamiento:any,ListaFinanciamientosAprobados:any) {
    this.exportActive = true;
    const listFinanciamiento: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ListaFinanciamiento);
    const listFinanciamientosAprobados: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ListaFinanciamientosAprobados);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, listFinanciamiento, 'Lista de financiamientos');
    XLSX.utils.book_append_sheet(wb, listFinanciamientosAprobados, 'Financiamientos aprobados');

    XLSX.writeFile(wb, 'ReporteFinanciamiento.xlsx');
  } 

  verGraficoGeneral(){

    var fechaInicio=this.formFiltroFechas.get("fechaInicio").value;
    var fechaFin=this.formFiltroFechas.get("fechaFin").value;
    var idUsuario=0;

    this.graficoGeneralAS=[]
    this.dashboardService.getGraficoGeneral(idUsuario,fechaInicio,fechaFin).subscribe( 
      response =>{
        this.graficoGeneralAS=response['datos'];

        this.dashboardGeneral();

      }

    )
    
  }

/*   public multi = [
    {
      "name": "China",
      "series": [
        {
          "name": "2018",
          "value": 2243772
        },
        {
          "name": "2017",
          "value": 1227770
        }
      ]
    },
    {
      "name": "USA",
      "series": [
        {
          "name": "2018",
          "value": 1126000
        },
        {
          "name": "2017",
          "value": 764666
        }
      ]
    },
    {
      "name": "Norway",
      "series": [
        {
          "name": "2018",
          "value": 296215
        },
        {
          "name": "2017",
          "value": 209122
        }
      ]
    },
    {
      "name": "Japan",
      "series": [
        {
          "name": "2018",
          "value": 257363
        },
        {
          "name": "2017",
          "value": 205350
        }
      ]
    },
    {
      "name": "Germany",
      "series": [
        {
          "name": "2018",
          "value": 196750
        },
        {
          "name": "2017",
          "value": 129246
        }
      ]
    },
    {
      "name": "France",
      "series": [
        {
          "name": "2018",
          "value": 204617
        },
        {
          "name": "2017",
          "value": 149797
        }
      ]
    }
  ]; */

}


