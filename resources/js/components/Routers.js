import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Example from './Example';
import Home from './Home';
import Viray from './Viray';

function Routers() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                    <div className="container">
                        <a className="navbar-brand" href="/">IPT2 Project</a>
                        <div className="navbar-nav">
                            <a className="nav-link" href="/">Home</a>
                            <a className="nav-link" href="/example">Example</a>
                            <a className="nav-link" href="/viray">Viray</a>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/example" element={<Example />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/viray" element={<Viray />} />
                </Routes>
            </div>
        </Router>
    );
}

export default Routers;

if (document.getElementById('root')) {
    ReactDOM.render(<Routers />, document.getElementById('root'));
}
