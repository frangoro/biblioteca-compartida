# biblioteca-compartida

Este proyecto fue creado con asistencia de [Perplexity](https://www.perplexity.ai/).

## Scripts Disponibles

En el directorio del proyecto, dentro de la carpeta client puedes ejecutar:

### `npm start`

Ejecuta la aplicación en modo de desarrollo.

Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recargará si haces modificaciones.

También verás errores de lint en la consola.

### `mongosh src/sql/biblioteca-compartida.js`

Genera la base de datos en MongoDB

### `systemctl start mongod.service`

Arranca servidor MongoDB

### `mongosh`
Acceder a la consola de MongoDB
### `use biblioteca-compartida`
Seleccionar la BD
### `db.user.find()`
Seleccionar todos los usuarios creados

### `npm run dev`

Arranca el servidor (backend) que está dentro de la carpeta server

## Estructura del proyecto
client
    src/  
    ├── components/       # Componentes reutilizables  
    │   ├── Button/       # Componente Button  
    │   ├── Header/       # Componente Header  
    │   └── Footer/       # Componente Footer  
    ├── pages/            # Vistas de la aplicación  
    │   ├── Home/         # Página de inicio
    │   ├── BookList/     # Página con el listado de libros del usuario
    │   ├── BookForm/     # Página para dar de alta un nuevo libro 
    │   ├── /             # Página 
    │   ├── About/        # Página   
    │   └── Contact/      # Página de contacto  
    ├── services/         # Lógica para llamadas a la API  
    │   ├── api.js        # Configuración de la API  
    │   └── auth.js       # Servicio de autenticación  
    ├── App.js            # Rutas principales  
    ├── index.js          # Punto de entrada  
server
    |

## Arquitectura
### Fronted
* SPA con React.js
* Estilos de la UI con Bootstrap
* Consume la API del backend mediante Fetch
### Backend
* Node.js
* Express.js
* MongoDB
