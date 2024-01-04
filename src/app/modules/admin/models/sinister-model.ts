export interface Sinister {
  idSiniestro?: number;
  idRiesgo?: number;
  feSiniestro?: any;
  importeSiniestro?: number;
  feInicioReparacion?: string;
  feFinReparacion?: string;
  peritado?: boolean;
  idEstado?: IdEstado;
  description?: string;
  refSiniestro?: any;
}

interface IdEstado {
  idEstado?: number;
  descripcion?: string;
}
