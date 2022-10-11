import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizesService } from 'src/app/services/authorizes.service';

@Component({
  selector: 'app-preevaluation-dialog',
  templateUrl: './preevaluation-dialog.component.html',
  styleUrls: ['./preevaluation-dialog.component.scss']
})
export class PreevaluationDialogComponent implements OnInit {

  constructor(
          private router: Router,
          private authorizesService: AuthorizesService
  ) { }

  ngOnInit(): void {
  }

  SolicitudPreevaluacion(): void{
    this.authorizesService.redirectSolicitudPreevaluacion();
  }

}
