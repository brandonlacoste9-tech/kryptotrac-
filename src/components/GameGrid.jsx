import React, { useState } from 'react';
import { Search } from 'lucide-react';
import GameCard from './GameCard';
import { gamesData } from '../data/games';
import SEO from './SEO';
import './GameGrid.css';

const GameGrid = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['Action', 'Strategy', 'Puzzle', 'Arcade', 'Cards', 'Bubble Shooters'];
  const filters = ['All', 'Free', 'Popular', ...categories];

  // First filter by search query
  const searchedGames = searchQuery.trim() 
    ? gamesData.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : gamesData;

  // Then filter by active tab (if searching, show results in a grid regardless of tab, unless a tab is forced)
  const isGridView = activeFilter !== 'All' || searchQuery.trim() !== '';
  
  const filteredGridGames = activeFilter === 'All'
    ? searchedGames
    : activeFilter === 'Popular'
      ? searchedGames.filter(game => game.isPopular)
      : activeFilter === 'Free'
        ? searchedGames.filter(game => game.isFree)
        : searchedGames.filter(game => game.category === activeFilter);

  return (
    <section className="game-section container">
      <SEO />
      <div className="section-header">
        <h2 className="section-title">
          Crypto <span className="text-gradient">Arcade</span>
        </h2>
        
        <div className="search-bar-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            className="search-input glass-input"
            placeholder="Search for a game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="section-filters">
          {filters.map(filter => (
            <button 
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => { setActiveFilter(filter); setSearchQuery(''); }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {isGridView ? (
        // Grid View (Search Results or Specific Category)
        <div className="game-grid">
          {filteredGridGames.length > 0 ? (
            filteredGridGames.map((game, index) => (
              <div key={game.id} style={{ animationDelay: `${(index % 12) * 0.05}s` }} className="animate-fade-in">
                <GameCard game={game} />
              </div>
            ))
          ) : (
            <div className="no-results">No games found. Try a different search.</div>
          )}
        </div>
      ) : (
        // Netflix-style Row View (The 'All' tab without active search)
        <div className="game-rows-container">
          
          {/* Free To Play Row */}
          <div className="game-row-section animate-fade-in" style={{ marginBottom: '1rem' }}>
            <div className="game-row-header">
              <h3><span className="text-gradient" style={{ background: 'linear-gradient(135deg, #00e5ff, #ff0080)', WebkitBackgroundClip: 'text' }}>Free To Play</span> This Week</h3>
              <button className="view-all-btn" onClick={() => setActiveFilter('Free')}>View All</button>
            </div>
            <div className="game-row" style={{ paddingBottom: '2rem' }}>
              {searchedGames.filter(g => g.isFree).map(game => (
                <div key={game.id} className="game-row-item">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>

          {/* Popular Games Row */}
          <div className="game-row-section animate-fade-in" style={{ marginBottom: '1rem' }}>
            <div className="game-row-header">
              <h3><span className="text-gradient">Most Popular</span> PC Games</h3>
              <button className="view-all-btn" onClick={() => setActiveFilter('Popular')}>View All</button>
            </div>
            <div className="game-row" style={{ paddingBottom: '2rem' }}>
              {searchedGames.filter(g => g.isPopular).map(game => (
                <div key={game.id} className="game-row-item" style={{ flex: '0 0 350px' }}>
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>

          {categories.map(category => {
            const categoryGames = searchedGames.filter(g => g.category === category).slice(0, 10);
            if (categoryGames.length === 0) return null;
            
            return (
              <div key={category} className="game-row-section animate-fade-in">
                <div className="game-row-header">
                  <h3>Top in {category}</h3>
                  <button className="view-all-btn" onClick={() => setActiveFilter(category)}>View All</button>
                </div>
                <div className="game-row">
                  {categoryGames.map(game => (
                    <div key={game.id} className="game-row-item">
                      <GameCard game={game} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default GameGrid;
