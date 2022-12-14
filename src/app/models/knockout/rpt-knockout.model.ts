export class RespuestaKnockoutModel{
    valid?:boolean;
    message?:string;
    idReglanockout?:number;
    fechaVencimientoRevisioAnual?: Date;
    fechaVencimientoCilindro?: Date;
    indicadorCreditoActivo?: boolean;
    indicadorParaConsumir?: boolean;
    indicadorAntiguedadMenos10Anios?: boolean;
    indicadorTitular20A65Anios?: boolean;
    indicadorDniRegistradoEnReniec?: boolean;
    indicadorDniTitularContrato?: string;
    indicadorLicenciaConducirVigente?: boolean;
    indicadorTitularPropietarioVehiculo?: boolean;
    indicadorSoatVigente?: boolean;
    indicadorVehiculoNoMultasPendientePago?: boolean;
    indicadorTitularNoMultasPendientePago?: boolean;
    indicadorVehiculoNoOrdenCaptura?: boolean;
    indicadorEstadoPreevaluacion?: boolean;
    idEstadoPrevaluacion?:number;
    estadoPrevaluacion?:string;
    fechaVencimientoSOAT?:string;
    indicadorVehiculoFuncionaGNV?:boolean;
    fileVehiculoGNV?:string;
    fileLicenciaVigente?:string;
    filePropietarioVehiculo?:string;
    fileSoatVigente?:string;
    fileMultastransito:string;
    fileOrdenCaptura?:string;
}
