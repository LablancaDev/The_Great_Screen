import 'bootstrap/dist/css/bootstrap.min.css'; //import de bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //import Script de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // import de Bootstrap Icons

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from './Contexto/Provider.jsx';

createRoot(document.getElementById('root')).render(
  <Provider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
