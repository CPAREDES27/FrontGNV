export class UsuarioModel {
    public idUsuario?: number;
    public usuarioEmail?: string;
    public contrasena?: string;
    public nomCliente?: string;
    public apeCliente?: string;
    public ruc?: string;
    public razonSocial?: string;
    public idTipoDocumento?: number;
    public numeroDocumento?: string;
    public rolId?: number;
    public fechaNacimiento?: Date;
    public estadoCivil?: number;
    public telefonoFijo?: string;
    public telefonoMovil?: string;
    public idTipoCalle?: number;
    public direccionResidencia?: string;
    public numeroIntDpto?: number;
    public manzanaLote?: string;
    public referencia?: string;
    public idDepartamento?: string;
    public idProvincia?: string;
    public idDistrito?: string;
    public activo?:boolean;
    public fecRegistro?: Date;
    public usuarioRegistra?: number;
    public usuarioModifica?: number;
    public fechaModifica?: Date;
}

export class AllUsuariosModel {
    public idUsuario?: number;
    public usuarioEmail?: string;
    public datosCliente?: string;
    public tipoDocumento?: string;
    public numeroDocumento?: string;
    public descRol?: string;
    public telefonoFijo?: string;
    public telefonoMovil?: string;
    public totalPag?: number;
}