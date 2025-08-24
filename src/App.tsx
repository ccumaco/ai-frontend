import React from 'react';
import Projects from './components/Projects';
import ProjectDetails from './components/ProjectDetails';
import ChatInterface from './components/ChatInterface';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className='min-h-screen flex'>
      <Router>
        <div className='flex-1'>
          <Routes>
            <Route path='/' element={<Projects />} />
            <Route path='/projects/:projectId' element={<ProjectDetails />} />
            <Route path='/chats/:chatId' element={<ChatInterface />} />
            {/* not found page == home */}
            <Route path='*' element={<Projects />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
