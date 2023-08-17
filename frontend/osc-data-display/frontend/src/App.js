import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import OSCDataDisplay from './OSCDataDisplay';
import PaintingCanvas from './PaintingCanvas';
import OSCPaintingCanvas from './OSCPaintingCanvas';




function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">OSC Data Display</Link>
            </li>
            <li>
              <Link to="/painting">Painting Canvas</Link>
            </li>
            <li>
              <Link to="/oscpainting">OSC Painting Canvas</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<OSCDataDisplay />} />
          <Route path="/painting" element={<PaintingCanvas />} />
          <Route path="/oscpainting" element={<OSCPaintingCanvas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
