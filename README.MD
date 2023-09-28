### /---------------------------------------Render Link---------------------------------------/

Link: https://mymercadopago.onrender.com/home

### /---------------------------------------Mercado Pago---------------------------------------/

Datod de prueba:

- Tarjeta de debito: 5031 7557 3453 0604
- Nombre de titular: APRO
- Código de seguridad: 123
- Fecha de caducidad: 11/25
- DNI: 12345678

Posible Error:
En el modo development es posible que al querer realizar una compra diga el error "Uno de los datos es de modo prueba",
si pasa eso:

1. Abrir una ventana incognito
2. Abrir el localhost en la nueva ventana
3. Logearse en mercado pago con esto datos de prueba :

- - Username: TESTUSER1608332342
- - Password: 84ZiK3QLDB

### /---------------------------------------Product---------------------------------------/

Para Crear un Product nuevo:
URL:

POST http://localhost:8080/products/createproduct

-body:
{
"title": "El Resplandor",
"description": "Una familia aislada en un hotel embrujado durante el invierno.",
"price": 15.699,
"thumbnail": "https://http2.mlstatic.com/D_NQ_NP_618680-MLA31092077635_062019-O.webp",
"category": [
"libros",
"ficcion",
"terror"
],
"marca": "EditorialABC",
"stock": 25,
"rating": 4.8
}

### /---------------------------------------User Admin---------------------------------------/

username: Admin01,
password: adminCod3r123

### /---------------------------------------Base de datos---------------------------------------/

uri: mongodb://localhost:27017/MercadoLibre

En la raiz del proyecto dejo los archivos para poder importar a MongoDB Compass:

- MercadoLibre.products.json
- MercadoLibre.users.json

estructura:

- Mercado Libre
- - carts
- - messages
- - products
- - sessions
- - tickets
- - users
