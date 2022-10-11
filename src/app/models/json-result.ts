export class JsonResult<TData> {
    public valid: boolean;
    public message: string;
    public detail: string;
    public data: TData;
    public warning: boolean;  
    public success: boolean;
    public exito: boolean;
    // public messaje: string;
    public activo: boolean;
    public idSfCliente: number;
    public idReglanockout:number;
    public idEvCrediticia:number;
    public valor:string;
    public mensaje:string;
    public listTipoProducto:any;
    public listMarcaProducto:any;
    public listProveedorProducto:any;
}
