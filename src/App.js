import Product from './component/formik.js';
import {BrowserRouter,Route,Routes} from 'react-router-dom';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/product" element={<Product/>}></Route>
        </Routes>
    </BrowserRouter>
    </div>
  );
}