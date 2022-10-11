import { Component, OnInit } from '@angular/core';
import ListaProductos from '../../listas/listaProductos.json';

@Component({
  selector: 'app-plantilla-correo',
  templateUrl: './plantilla-correo.component.html',
  styleUrls: ['./plantilla-correo.component.scss']
})
export class PlantillaCorreoComponent implements OnInit {
  
  listaProductos = ListaProductos;

  constructor() { }

  ngOnInit(): void {
  
  }


}
