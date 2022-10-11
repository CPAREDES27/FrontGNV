export enum ExpressionValidation {
    LetterSpace = '^(?!\\s*$)[-a-zA-ZáéíóúÁÉÍÓÚÑñ.\\s]{1,200}$',
    LetterSpaceNumber = '^(?!\\s*$)[-a-zA-Z0-9áéíóúÁÉÍÓÚ.\\s]{1,200}$',
    LetterNumber = '^(?!\\s*$)[-a-zA-Z0-9áéíóúÁÉÍÓÚ]{1,200}$',
    Ruc = '(\\d{11})',
    Dni = '(\\d{8})',
    NroC = '(\\d{6})',
	Telefono = '^[0-9]{7,10}$',
	Celular = '^[0-9]{9,12}$',
    Correo = '^[\\w-_.+]*[\\w-_.]@([\\w]+\\.)+[\\w]+[\\w]$',
    AddressStreet = '^(?!\\s*$)[-a-zA-Z0-9áéíóúÁÉÍÓÚ./-\\s]{5,}$',
    Cpi = '(\\d{6,7})',
    Number = '^(?!\\s*$)[0-9./-]{1,200}$',
    PassWord = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'
  }