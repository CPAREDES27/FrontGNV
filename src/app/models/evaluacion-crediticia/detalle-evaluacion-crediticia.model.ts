export class DetalleEvaluacionCrediticiaModel {
    public idEvCliente?: number;
    public nombres?: string;
    public apellidos?: string;
    public numDocumento?: string;
    public fechaNacimiento?: string;
    public telefonoFijo?: string;
    public telefonoMovil?: string;
    public usuarioEmail?: string;
    public nombreProducto?: string;
    public precioProducto?: number;
    public nombreProveedor?: string;
    public idPreevaluacion?: number;
    public numeroScrore?:number;
    public observaciones?:string;
    public idEstado?:number;
    public numExpediente?:string;
    public fechaDespacho?: string;
    public informacionCR?: number;
    public lineaCredito?: number;
    public infoCR?:boolean;
    public deudaMas6Entidades?:boolean;
    public deudasMas6vecesIngreso?:boolean;
    public reporteDeudaSBS?:string;
    public message?:string;
}