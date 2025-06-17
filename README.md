# biblioteca-compartida

Este proyecto fue creado con asistencia de [Perplexity](https://www.perplexity.ai/).

## Scripts Disponibles

### Genera la base de datos en MongoDB

* `mongosh src/sql/biblioteca-compartida.js`
La primera vez puedes cargar la base de datos

### Arranca servidor MongoDB

* `systemctl start mongod.service`

* `mongosh`
Acceder a la consola de MongoDB
* `use biblioteca-compartida`
Seleccionar la BD
* `db.user.find()`
Seleccionar todos los usuarios creados

### Arranca el servidor (backend). Está dentro de la carpeta server

* `npm run dev`
Ejecuta la aplicación en modo de desarrollo.

### Arranca el cliente. Está dentro de la carpeta client

* `npm start`

Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recargará si haces modificaciones.

También verás errores de lint en la consola.


## Estructura del proyecto
client/
├── src/
│   ├── components/       # Componentes React reutilizables
│   │   ├── Button/       #   ├── Componente Button
│   │   ├── Header/       #   ├── Componente Header
│   │   └── Footer/       #   └── Componente Footer
│   ├── pages/            # Vistas principales de la aplicación
│   │   ├── Home/         #   ├── Página de inicio
│   │   ├── BookList/     #   ├── Página con el listado de libros del usuario
│   │   ├── BookForm/     #   ├── Página para dar de alta un nuevo libro
│   │   ├── Users/        #   ├── Página de gestión de usuarios
│   │   ├── About/        #   ├── Página "Acerca de"
│   │   └── Contact/      #   └── Página de contacto
│   ├── services/         # Servicios de comunicación con el backend
│   │   ├── api.js        #   ├── Configuración de comunicación con la API del servidor
│   │   └── auth.js       #   └── Servicio de autenticación
│   ├── App.js            # Componente raíz donde se configuran las rutas y se montan otros componentes
│   └── index.js          # Punto de entrada principal de la aplicación React
server/
├── models/               # Modelos de datos con Mongoose (para interacción con la base de datos)
├── routes/               # Rutas en Express.js (controladores que atienden las solicitudes HTTP del cliente)
├── server.js             # Configuración principal del servidor (conexión a DB, arranque, activación de rutas)
└── sql/                  # Scripts SQL para la base de datos

## Arquitectura
Se usa el stack MERN
### Fronted
* SPA con React.js
* Estilos de la UI con Bootstrap
* Consume la API del backend mediante Fetch
### Backend
* Node.js
* Express.js
* MongoDB
