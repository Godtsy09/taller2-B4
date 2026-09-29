import { Routes } from '@angular/router';
import { FormularioProductoComponent } from './components/formulario-producto/formulario-producto';
import { InfoTiendaComponent } from './components/info-tienda/info-tienda';

export const routes: Routes = [
  { path: 'registro', component: FormularioProductoComponent },
  { path: 'tienda', component: InfoTiendaComponent },
  { path: '', redirectTo: '/registro', pathMatch: 'full' },
  { path: '**', redirectTo: '/registro' }
];
