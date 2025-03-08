# biblioteca-compartida

Este proyecto fue creado con asistencia de [Perplexity](https://www.perplexity.ai/).

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Ejecuta la aplicación en modo de desarrollo.

Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recargará si haces modificaciones.

También verás errores de lint en la consola.

## Estructura del proyecto
src/  
├── components/       # Componentes reutilizables  
│   ├── Button/       # Componente Button  
│   ├── Header/       # Componente Header  
│   └── Footer/       # Componente Footer  

├── pages/            # Páginas principales  
│   ├── Home/         # Página de inicio  
│   ├── About/        # Página "Acerca de"  
│   └── Contact/      # Página de contacto  

├── services/         # Lógica para llamadas a la API  
│   ├── api.js        # Configuración de la API  
│   └── auth.js       # Servicio de autenticación  

├── App.js            # Rutas principales  

├── index.js          # Punto de entrada  
