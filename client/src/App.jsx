import Room from './components/Room';
import Home from './pages/Home';
import Navigation from './components/Navbar';
import UploadFile from './pages/UploadFile';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App" style={{backgroundColor: '#242424', height:'auto', color: '#f5f5f5'}}>
      <ToastContainer />
      <Navigation></Navigation>
      <Routes>
        <Route path='/'>
          <Route index element={<Home />}></Route>
          <Route path='/play/:room' element={<Room />}></Route>
          <Route path='/upload' element={<UploadFile />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;