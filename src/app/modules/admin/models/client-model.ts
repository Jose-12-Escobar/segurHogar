import { Policy } from "./policy-model";

export interface Client  {
  idCliente : number;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  documento?: string;
  fechaNacimiento?: string;
  mail?: string;
  telefono?: string;
  calle?: string;
  numero?: number;
  piso?: string;
  codPostal?: number;
  localidad?: string;
  tipoCalle?: string;
  puerta?: string;
  provincia?: string;
  polizas : Policy[];
}

