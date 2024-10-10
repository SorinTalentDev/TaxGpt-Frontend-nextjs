import React from 'react';
import Chat from './components/Chat';
import Footer from './components/Footer';
import Header from './components/Header';
import Navigation from './components/Sidebar';
import './App.css';

function App() {

  return (
    <div className="body">
      <Header />
      <section className='main-board'>
        <Navigation />
        <div className='main-content'>
          <div className='write-prompt'>
            <Chat />
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
