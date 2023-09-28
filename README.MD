### /---------------------------------------Base de datos---------------------------------------/

uri: mongodb://localhost:27017/MercadoLibre

estructura:

- Mercado Libre
- - carts
- - messages
- - products
- - sessions
- - tickets
- - users
    En la raiz del proyecto dejo los archivos:
    - MercadoLibre.products.json
    - MercadoLibre.users.json
      para poder importar a MongoDB Compass

### /---------------------------------------Mercado Pago---------------------------------------/

Datod de prueba:

- Tarjeta de debito: 5031 7557 3453 0604
- Nombre de titular: APRO
- Código de seguridad: 123
- Fecha de caducidad: 11/25
- DNI: 12345678

Posible Error:
En el modo development es posible que al querer realizar una compra diga el error "Uno de los datos es de modo prueba",
si pasa eso abrir una ventana incognito abrir el localhost en la nueva ventana y logearse en mercado pago con esto datos de prueba :

- Username: TESTUSER1608332342
- Password: 84ZiK3QLDB
