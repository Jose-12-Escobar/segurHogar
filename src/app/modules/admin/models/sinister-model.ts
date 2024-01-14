export interface Sinister {
  idSiniestro : number;
  idRiesgo?: number;
  feSiniestro : string;
  importeSiniestro?: number|null;
  feInicioReparacion?: string|null ;
  feFinReparacion?: string|null;
  peritado?: boolean;
  idEstado?: IdEstado;
  description?: string;
  refSiniestro?: string;
  numPoliza ?: string;
}

export interface IdEstado {
  idEstado?: number;
  descripcion?: string;
}
