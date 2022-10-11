export class OpcionesModel {
    idDetalle?: number;
    descripcion?: string;
}

export class PreguntasModel {
    id?: number;
    pregunta?: string;
    textAyuda?: string;
    tipoDato?: string;
    opciones?: OpcionesModel[];
}
