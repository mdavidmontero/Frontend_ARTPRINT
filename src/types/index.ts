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
