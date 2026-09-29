import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [];
  private nextId = 1;

  registrarProducto(producto: Producto): Observable<Producto> {
    console.log('Registrando producto:', producto);

    const nuevoProducto: Producto = {
      ...producto,
      id: this.nextId++
    };

    this.productos.push(nuevoProducto);
    console.log('Producto guardado. Total productos:', this.productos.length);

    return of(nuevoProducto).pipe(delay(500));
  }

  obtenerProductos(): Observable<Producto[]> {
    console.log('Obteniendo productos:', this.productos);
    return of([...this.productos]).pipe(delay(300));
  }
}