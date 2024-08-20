# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Proyecto: Videoclub Online

Este proyecto es un videoclub online que utiliza diversas tecnologías y técnicas modernas para ofrecer una experiencia de usuario eficiente.

#### **Frontend:**
- **React**: Utilizado para la creación del frontend y las vistas al usuario, manejando los diferentes estados de la aplicación.
- **Bootstrap**: Implementado para el diseño responsive de la aplicación, asegurando una experiencia de usuario consistente en todos los dispositivos.
- **Vite**: Utilizado para optimizar el entorno de desarrollo con una configuración rápida y soporte para Hot Module Replacement (HMR).

#### **Backend:**
- **Node.js**: Sirve como el entorno de ejecución del backend, manejando la lógica del servidor y la conexión con la base de datos.
- **Express**: Empleado para crear el servidor y las rutas API que gestionan la comunicación entre el frontend y la base de datos.
- **MySQL/Turso**: Utilizados para gestionar y almacenar los datos del videoclub, como información de películas, usuarios, y valoraciones.

#### **Técnicas y Hooks Utilizados:**
- **useState**: Usado para gestionar el estado local de los componentes, como el control de formularios y listas dinámicas.
- **useReducer**: Implementado para manejar el estado de las actualizaciones de datos de las películas, como la visualización, valoración y comentarios, además del registro y login de usuarios.
- **useEffect**: Utilizado para manejar efectos secundarios como la carga inicial de datos y las actualizaciones basadas en cambios de estado o props.
- **react-router-dom**: Implementado para gestionar la navegación entre las diferentes páginas de la aplicación, permitiendo una experiencia de usuario fluida y sin recargas.
- **API Fetch y Axios**: Utilizados para realizar solicitudes HTTP a la API del backend y a servicios externos como TMDB, facilitando la obtención y actualización de datos.
- **Debounce en el Buscador de Películas**: Implementado para mejorar el rendimiento del buscador limitando la frecuencia de las solicitudes a la API.

#### **Otras Tecnologías y Conceptos:**
- **TMDB API**: Integrada para obtener información detallada de películas, que se muestra a los usuarios en la aplicación.
- **Conexión a Múltiples Bases de Datos**: Configurada para manejar datos desde diferentes bases (MySQL y Turso), proporcionando flexibilidad y escalabilidad en la gestión de la información.

Este proyecto combina estas tecnologías y técnicas para ofrecer un videoclub online funcional y optimizado, ofreciendo a los usuarios una experiencia fluida en la búsqueda y gestión de películas.