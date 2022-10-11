class MenusHijo {
    idPadre: number;
    idHijo: number;
    idOpcion: number;
    descMenu: string;
    url: string;
    activoHijo: boolean;
}

class MenusPadre {
    idPadre: number;
    descMenu: string;
    urlImagen: string;
    menusHijos: MenusHijo[];
}

class Menus {
    menusPadre: MenusPadre[];
}

export class MenuOptionsModel {
    menus: Menus;
}
