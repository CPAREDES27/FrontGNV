export class UsuarioRegistrarRequestModel{
    public NomCliente?: string;
    public ApeCliente?: string;
    public UsuarioEmail?: string;
    public Contrasena?: string;
    public RazonSocial?: string;
    public Ruc?: string;
    public RolId?: number;
    public TelefonoFijo?: string;
    public TelefonoMovil?: string;  
    public TermPoliticasPrivacidad?: boolean;
    public TermFinesComerciales?: boolean;  
    public idTipoDocumento?: number;
    public numeroDocumento?: string;
}