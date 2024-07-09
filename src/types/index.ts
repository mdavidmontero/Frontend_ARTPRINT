import { z } from "zod";

const authSchema = z.object({
  name: z.string(),
  identificacion: z.string(),
  telefono: z.number(),
  direccion: z.string(),
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string(),
});

export type Auth = z.infer<typeof authSchema>;

export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<
  Auth,
  | "name"
  | "identificacion"
  | "telefono"
  | "direccion"
  | "email"
  | "password"
  | "password_confirmation"
>;

export const userSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    _id: z.string(),
  });
export type User = z.infer<typeof userSchema>;

export enum RolUsuario {
  ADMIN = "ADMIN",
  CLIENTE = "CLIENTE",
}

export type Usuario = {
  id: string;
  cedula: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  telefono: string;
  direccion: string;
  fotoPerfil: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createUsuario = (
  id: string,
  cedula: string,
  nombre: string,
  correo: string,
  rol: RolUsuario,
  telefono: string,
  direccion: string,
  fotoPerfil: string,
  createdAt: Date,
  updatedAt: Date
): Usuario => ({
  id,
  cedula,
  nombre,
  correo,
  rol,
  telefono,
  direccion,
  fotoPerfil,
  createdAt,
  updatedAt,
});

export type Colors = {
  id: string;
  nombre: string;
  imagenUrl: string;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  colores: Colors[];
  createdAt: Date;
  updatedAt: Date;
};
// export type Producto = {
//   id: string;
//   nombre: string;
//   descripcion: string;
//   precio: number;
//   imagenUrl: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

export type Categoria = {
  id: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Prenda = {
  id: string;
  nombre: string;
  idCategoria: string;
  precio: number;
  createdAt: Date;
  updatedAt: Date;
};

export const createPrenda = (
  id: string,
  nombre: string,
  idCategoria: string,
  precio: number,
  createdAt: Date,
  updatedAt: Date
): Prenda => ({
  id,
  nombre,
  idCategoria,
  precio,
  createdAt,
  updatedAt,
});

export type Talla = {
  id: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createTalla = (
  id: string,
  nombre: string,
  createdAt: Date,
  updatedAt: Date
): Talla => ({
  id,
  nombre,
  createdAt,
  updatedAt,
});

export type Color = {
  id: string;
  nombre: string;
  codigo?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createColor = (
  id: string,
  nombre: string,
  codigo: string | undefined,
  createdAt: Date,
  updatedAt: Date
): Color => ({
  id,
  nombre,
  codigo,
  createdAt,
  updatedAt,
});

export type Material = {
  id: string;
  nombre: string;
  precioExtra: number;
  createdAt: Date;
  updatedAt: Date;
};

export const createMaterial = (
  id: string,
  nombre: string,
  precioExtra: number,
  createdAt: Date,
  updatedAt: Date
): Material => ({
  id,
  nombre,
  precioExtra,
  createdAt,
  updatedAt,
});

export type WhatsApp = {
  id: string;
  phoneNumber: string;
  countryCode: string;
};

export const createWhatsApp = (
  id: string,
  phoneNumber: string,
  countryCode: string
): WhatsApp => ({
  id,
  phoneNumber,
  countryCode,
});

export type ItemCarrito = {
  productoId: string;
  imagen: string;
  nombre: string;
  idPrenda: string;
  idMaterial: string;
  idColor: string;
  talla: string;
  genero: string;
  cantidad: number;
  precio: number;
};
export type Carrito = {
  id: string;
  usuarioId: string;
  items: ItemCarrito[];
  createdAt: Date;
  updatedAt: Date;
};

export const createCarrito = (
  id: string,
  usuarioId: string,
  items: ItemCarrito[],
  createdAt: Date,
  updatedAt: Date
): Carrito => ({
  id,
  usuarioId,
  items,
  createdAt,
  updatedAt,
});
