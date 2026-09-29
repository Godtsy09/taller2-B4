import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-info-tienda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-tienda.html',
  styleUrl: './info-tienda.css'
})
export class InfoTiendaComponent implements OnInit {
  productos = signal<Producto[]>([]);
  cargando = signal(true);

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.productos.set([]);
        this.cargando.set(false);
      }
    });
  }

  getRareza(stock: number): { label: string; class: string } {
    if (stock === 0) return { label: 'AGOTADO', class: 'rareza-agotado' };
    if (stock <= 2) return { label: 'LEGENDARIO', class: 'rareza-legendario' };
    if (stock <= 5) return { label: 'ÉPICO', class: 'rareza-epico' };
    if (stock <= 10) return { label: 'RARO', class: 'rareza-raro' };
    return { label: 'COMÚN', class: 'rareza-comun' };
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(precio).replace('\$', '◇');
  }

  getTotalStock(): number {
    return this.productos().reduce((sum, p) => sum + p.stock, 0);
  }

  trackById(index: number, producto: Producto): number {
    return producto.id ?? index;
  }
}
