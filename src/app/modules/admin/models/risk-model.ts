import { Sinister } from "./sinister-model";

export interface Risk {
  idRiesgo : number;
  idPoliza ?: number;
  tipoCalle?: string;
  noCalle?: string;
  numero?: string;
  piso?: string;
  puerta?: string;
  coPostal?: string;
  localidad?: string;
  provincia?: string;
  siniestros ?: Sinister;
  nuPoliza ?: string;
}

