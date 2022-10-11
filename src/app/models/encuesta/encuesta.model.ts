export class DetailsQuestionModel {
    idDetalle: number;
    idPregunta: number;
    descripion: string;
    activo: boolean;
}

export class EncuestaModel {
    idPregunta?: number;
    pregunta?: string;
    textAyuda?: string;
    tipoDato?: string;
    activoCabecera?: boolean;
    detailsQuestions?: DetailsQuestionModel[];
}

export class RootObject {
    id: number;
    pregunta: string;
    textAyuda: string;
    tipoDato: string;
}