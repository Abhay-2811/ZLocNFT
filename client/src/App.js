import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Navbar from './Components/NAvbar';
import './flow/config'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
