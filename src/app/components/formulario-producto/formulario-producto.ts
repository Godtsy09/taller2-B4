import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-formulario-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-producto.html',
  styleUrl: './formulario-producto.css'
})
export class FormularioProductoComponent {
  form: FormGroup;
  categorias = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Otros'];
  mensajeExito = signal('');
  enviando = signal(false);

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.form = this.fb.group({
      nombre: [null, [Validators.required, Validators.minLength(3)]],
      descripcion: [null, [Validators.required, Validators.minLength(10)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      categoria: [null, Validators.required],
      stock: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]]
    });
  }

  get f() {
    return this.form.controls;
  }

  getErrores(controlName: string): string[] {
    const control = this.form.get(controlName);
    const errores: string[] = [];

    if (!control || !control.errors) return errores;

    if (control.errors['required']) {
      errores.push(this.getLabel(controlName) + ' es requerido');
    }
    if (control.errors['minlength']) {
      const req = control.errors['minlength'].requiredLength;
      errores.push(this.getLabel(controlName) + ' debe tener al menos ' + req + ' caracteres');
    }
    if (control.errors['min']) {
      const min = control.errors['min'].min;
      errores.push(this.getLabel(controlName) + ' debe ser mayor a ' + min);
    }
    if (control.errors['pattern']) {
      errores.push(this.getLabel(controlName) + ' debe ser un número entero');
    }

    return errores;
  }

  private getLabel(controlName: string): string {
    const labels: Record<string, string> = {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      precio: 'Precio',
      categoria: 'Categoría',
      stock: 'Stock'
    };
    return labels[controlName] || controlName;
  }

  guardarProducto(): void {
    this.mensajeExito.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    const producto = this.form.value;

    this.productoService.registrarProducto(producto).subscribe({
      next: (resp) => {
        console.log('Producto registrado con ID:', resp.id);
        this.mensajeExito.set('✓ Producto "' + resp.nombre + '" registrado correctamente (ID: ' + resp.id + ')');
        this.form.reset();
        this.enviando.set(false);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.mensajeExito.set('✗ Error al registrar el producto');
        this.enviando.set(false);
      }
    });
  }
}
