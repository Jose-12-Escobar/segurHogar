import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidbar',
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.css']
})

export class SidebarComponent implements OnInit, OnDestroy {

  items !: MenuItem[];

  constructor() {

  }

  ngOnInit() {
    this.items = [
      {
        label: 'Clientes',
        items: [
          { label: 'Nuevo', icon: 'pi pi-user-plus', routerLink: '/admin/newClient', styleClass: "text-decoration-none" },
          { label: 'Modificar', icon: 'pi pi-user-edit', routerLink: '/admin/modifyClient' },
          { label: 'Lista', icon: 'pi pi-list', routerLink: '/admin/listClient' },
          { label: 'Buscar', icon: 'pi pi-search', routerLink: '/admin/searchClient' }
        ]
      },
      {
        label: 'Polizas',
        items: [
          { label: 'Crear', icon: 'bi bi-file-earmark-lock', routerLink: '/admin/newPolicy' },
          { label: 'Modificar', icon: 'bi bi-file-earmark-diff', routerLink: '/admin/modifyPolicy'  },
          { label: 'Lista', icon: 'bi bi-files', routerLink: '/admin/listPolicy' }
        ]
      },
      {
        label: 'Riesgos',
        items: [
          { label: 'Modificar', icon: 'bi bi-house-gear', routerLink: '/admin/modifyRisk'  },
          { label: 'Lista', icon: 'bi bi-houses', routerLink: '/admin/listRisk' }
        ]
      },
      {
        label: 'Siniestros',
        items: [
          { label: 'Nuevo', icon: 'bi bi-house-exclamation', routerLink: '/admin/newSinister' },
          { label: 'Modificar', icon: 'bi bi-tools', routerLink:'/admin/modifySinister' },
          { label: 'Lista', icon: 'pi pi-list', routerLink: '/admin/listSinister' }
        ]
      }
    ];
  }

  ngOnDestroy(): void {
  }

}
