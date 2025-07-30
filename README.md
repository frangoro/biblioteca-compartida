# biblioteca-compartida

Este proyecto fue creado con asistencia de [Perplexity](https://www.perplexity.ai/).

## Scripts Disponibles

### Genera la base de datos en MongoDB

* `mongosh sql/biblioteca-compartida.js`
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
│   ├── styles/                          # Estilos globales y utilidades
│   │   ├── base/                        # Resets, tipografía base, variables
│   │   │   ├── _reset.css
│   │   │   ├── _variables.css           # Variables CSS para colores, fuentes, espaciados
│   │   │   └── _typography.css
│   │   ├── layouts/                     # Estilos para estructuras principales (header, footer, sidebar)
│   │   │   └── _main-layout.css
│   │   ├── components/                  # Estilos genéricos para componentes "puros" (botones, tarjetas)
│   │   │   └── _buttons.css
│   │   └── utilities/                   # Clases de ayuda (margen, padding, display)
│   │       └── _spacing.css
│   │   ├── App.js            # Componente raíz donde se configuran las rutas y se montan otros componentes  
│   │   └── index.js          # Punto de entrada principal de la aplicación React  
│   │   └── index.css         # Importación de los estilos globales de la aplicación
server/
├── models/               # Modelos de datos con Mongoose (para interacción con la base de datos)  
├── routes/               # Rutas en Express.js (endpoints que atienden las solicitudes HTTP del cliente)  
├── controllers/
|   └── userController.js # Lógica de negocio para el módulo de usuarios
├── middleware/  
|   └── authMiddleware.js # Autenticación y Autorización
├── server.js             # Configuración principal del servidor (conexión a DB, arranque, activación de rutas)  
└── sql/                  # Scripts SQL para la base de datos 

src/
├── App.js
├── index.js
├── styles/                          # Estilos globales y utilidades
│   ├── base/                        # Resets, tipografía base, variables
│   │   ├── _reset.css
│   │   ├── _variables.css           # Variables CSS para colores, fuentes, espaciados
│   │   └── _typography.css
│   ├── layouts/                     # Estilos para estructuras principales (header, footer, sidebar)
│   │   └── _main-layout.css
│   ├── components/                  # Estilos genéricos para componentes "puros" (botones, tarjetas)
│   │   └── _buttons.css
│   └── utilities/                   # Clases de ayuda (margen, padding, display)
│       └── _spacing.css
├── components/
│   ├── UserCard/
│   │   ├── UserCard.js
│   │   └── UserCard.module.css      # Estilos específicos del componente UserCard (CSS Modules)
│   ├── Navbar/
│   │   ├── Navbar.js
│   │   └── Navbar.module.css
│   └── SharedButton/                # Componente de botón reutilizable si no se usa un CSS global de botones
│       ├── SharedButton.js
│       └── SharedButton.module.css
├── pages/
│   ├── UserListPage/
│   │   ├── UserListPage.js
│   │   └── UserListPage.module.css  # Estilos específicos de la página UserListPage
│   ├── UserFormPage/
│   │   ├── UserFormPage.js
│   │   └── UserFormPage.module.css
│   └── LoginPage/
│       ├── LoginPage.js
│       └── LoginPage.module.css
└── services/
└── assets/
    └── images/

## Pantallas
* Home
Pantalla de inicio. Muestra directamente el catálogo completo con los libros de todos los usuarios.
Scroll infinito.
* Mis libros
* Mi usuario / Registro
* Login
* Gestión usuarios
* Ver libro
* Solicitar préstamo

## Componentes
* Logotipo y marca
* Título de la pantalla
* Menú de navegación
* Herramienta de búsqueda
* Mosaico de muestra de los últimos libros añadidos

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
