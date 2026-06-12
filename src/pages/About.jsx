import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ paddingTop: '120px', minHeight: '100vh', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>About <span className="text-gradient">Hell Yeah Games</span></h1>
      <div className="glass-panel" style={{ padding: '2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Welcome to Hell Yeah Games, the next generation of online game distribution. We are dedicated to bringing you the best HTML5 web games and premium downloadable desktop games all in one beautifully designed platform.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          Our SaaS model allows developers to easily monetize their games, while players get unlimited access to a growing catalog of 200+ high-quality titles for a single, low monthly subscription.
        </p>
        <p>
          Whether you're into intense action games, mind-bending puzzles, or classic arcade retro remakes, Hell Yeah Games is your ultimate gaming destination.
        </p>
      </div>
    </div>
  );
};

export default About;
