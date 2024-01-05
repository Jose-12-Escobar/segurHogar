export interface Sinister {
  idSiniestro?: number;
  idRiesgo?: number;
  feSiniestro?: string;
  importeSiniestro?: number;
  feInicioReparacion?: string;
  feFinReparacion?: string;
  peritado?: boolean;
  idEstado?: IdEstado;
  description?: string;
  refSiniestro?: string;
}

interface IdEstado {
  idEstado?: number;
  descripcion?: string;
}
