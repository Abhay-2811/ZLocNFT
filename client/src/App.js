import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Mint from './Pages/Mint';
import Vote from './Pages/Vote';
import MintNFT from './Pages/MintNFT';
import ViewPoap from './Pages/ViewPoap';
import Navbar from './Components/Navbar';
import './flow/config'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route exact path='/mint' element={<Mint />}></Route>
        <Route exact path='/vote' element={<Vote />}></Route>
        <Route exact path='/mintNFT' element={<MintNFT />}></Route>
        <Route exact path='/view' element={<ViewPoap />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
