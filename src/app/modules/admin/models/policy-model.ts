import { Risk } from "./risk-model";

export interface Policy {
  idPoliza : number;
  feInicio : string;
  idCliente : number;
  feVencimiento : string;
  prima?: number;
  nuPoliza : string;
  riesgos : Risk[];
  idSituacionPoliza?: IdSituacionPoliza;
  nuCuenta?: string;
  idModalidad?: IdModalidad;
}

interface IdSituacionPoliza {
  idEstado?: number;
  descripcion?: string;
}

interface IdModalidad {
  idModalidad?: number;
  descripcion?: string;
}
