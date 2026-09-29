import { TestBed } from '@angular/core/testing';
import { InfoTiendaComponent } from './info-tienda';
import { ProductoService } from '../../services/producto';
import { of } from 'rxjs';
import { Producto } from '../../models/producto';

describe('InfoTiendaComponent', () => {
  let component: InfoTiendaComponent;
  let mockProductoService: jasmine.SpyObj<ProductoService>;

  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Cyberdeck Mk.7', descripcion: 'Deck de última generación para netrunners', precio: 5000, categoria: 'Electrónica', stock: 3 },
    { id: 2, nombre: 'Implante Óptico', descripcion: 'Visión nocturna y zoom táctico', precio: 12000, categoria: 'Electrónica', stock: 1 },
    { id: 3, nombre: 'Chaqueta Blindada', descripcion: 'Kevlar ligero con refrigeración', precio: 3500, categoria: 'Ropa', stock: 15 }
  ];

  beforeEach(() => {
    mockProductoService = jasmine.createSpyObj('ProductoService', ['obtenerProductos']);
    mockProductoService.obtenerProductos.and.returnValue(of(mockProductos));

    TestBed.configureTestingModule({
      imports: [InfoTiendaComponent],
      providers: [
        { provide: ProductoService, useValue: mockProductoService }
      ]
    });

    const fixture = TestBed.createComponent(InfoTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(mockProductoService.obtenerProductos).toHaveBeenCalled();
    expect(component.productos().length).toBe(3);
    expect(component.cargando()).toBeFalse();
  });

  it('should calculate rarity correctly', () => {
    expect(component.getRareza(0).label).toBe('AGOTADO');
    expect(component.getRareza(1).label).toBe('LEGENDARIO');
    expect(component.getRareza(3).label).toBe('LEGENDARIO');
    expect(component.getRareza(5).label).toBe('ÉPICO');
    expect(component.getRareza(8).label).toBe('RARO');
    expect(component.getRareza(15).label).toBe('COMÚN');
  });

  it('should format price correctly', () => {
    expect(component.formatearPrecio(5000)).toContain('5.000');
    expect(component.formatearPrecio(12000.50)).toContain('12.000');
  });

  it('should track by id', () => {
    const producto: Producto = { id: 1, nombre: 'Test', descripcion: 'Test', precio: 100, categoria: 'Test', stock: 1 };
    expect(component.trackById(0, producto)).toBe(1);
  });
});