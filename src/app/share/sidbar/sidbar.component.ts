import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/modules/admin/services/local-storage.service';

@Component({
  selector: 'app-sidbar',
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.css']
})

export class SidebarComponent implements OnInit {

  items !: MenuItem[];
  isAdmin : boolean = false;
  isClient : boolean = false;

  constructor( private _localStorageService: LocalStorageService) {
    this.typeRole();
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Clientes',
        items: [
          { label: 'Nuevo', icon: 'pi pi-user-plus', routerLink: '/admin/newClient', styleClass: "text-decoration-none", visible: this.isAdmin  },
          { label: 'Modificar', icon: 'pi pi-user-edit', routerLink: '/admin/modifyClient', visible: this.isAdmin  },
          { label: 'Lista', icon: 'pi pi-list', routerLink: '/admin/listClient', visible: this.isAdmin  },
          { label: 'Buscar', icon: 'pi pi-search', routerLink: '/admin/searchClient', visible: this.isAdmin },
          { label: 'Mis datos', icon: 'bi bi-person-lines-fill', routerLink: '/client/dataClient', visible: this.isClient }
        ]
      },
      {
        label: 'Polizas',
        items: [
          { label: 'Crear', icon: 'bi bi-file-earmark-lock', routerLink: '/admin/newPolicy', visible: this.isAdmin },
          { label: 'Modificar', icon: 'bi bi-file-earmark-diff', routerLink: '/admin/modifyPolicy', visible: this.isAdmin  },
          { label: 'Lista', icon: 'bi bi-files', routerLink: '/admin/listPolicy', visible: this.isAdmin },
          { label: 'Mis polizas', icon: 'bi bi-file-earmark-lock-fill', routerLink: '/client/dataPolicy', visible: this.isClient }
        ]
      },
      {
        label: 'Riesgos',
        items: [
          { label: 'Modificar', icon: 'bi bi-house-gear', routerLink: '/admin/modifyRisk', visible: this.isAdmin  },
          { label: 'Lista', icon: 'bi bi-houses', routerLink: '/admin/listRisk', visible: this.isAdmin }
        ], visible: this.isAdmin
      },
      {
        label: 'Siniestros',
        items: [
          { label: 'Nuevo', icon: 'bi bi-house-exclamation', routerLink: '/admin/newSinister', visible: this.isAdmin },
          { label: 'Modificar', icon: 'bi bi-tools', routerLink:'/admin/modifySinister', visible: this.isAdmin },
          { label: 'Lista', icon: 'pi pi-list', routerLink: '/admin/listSinister', visible: this.isAdmin },
          { label: 'Mis siniestros', icon: 'bi bi-wrench-adjustable', routerLink: '/client/dataSinister', visible: this.isClient}

        ]
      },

    ];
  }

 typeRole() {

  if (this._localStorageService.getItem('role') === 'ROLE_ADMIN') {
    this.isAdmin = true;
  }if (this._localStorageService.getItem('role') === 'ROLE_USER') {
    this.isClient = true;
  }

 }

}
