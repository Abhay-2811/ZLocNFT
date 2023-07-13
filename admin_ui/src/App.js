import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Sidebar from './Components/Sidebar';
import './flow/config'
function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
