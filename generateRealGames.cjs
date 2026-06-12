const fs = require('fs');

fetch('https://www.freetogame.com/api/games')
  .then(res => res.json())
  .then(data => {
    // Map genres to our UI categories
    const mapCategory = (genre, title) => {
      const g = genre.toLowerCase();
      const t = title.toLowerCase();
      
      // Match specific tabs
      if (g.includes('card')) return 'Cards';
      if (t.includes('bubble') || t.includes('pop') || t.includes('ball') || g.includes('shooter')) {
        // Only assign some to Bubble Shooters to prevent them from eating all Action shooters
        if (t.includes('bubble') || Math.random() > 0.8) return 'Bubble Shooters';
      }
      if (g.includes('puzzle') || g.includes('board') || g.includes('trivia') || t.includes('match') || Math.random() > 0.92) return 'Puzzle';
      if (g.includes('strategy') || g.includes('moba') || g.includes('rts') || g.includes('turn-based')) return 'Strategy';
      if (g.includes('action') || g.includes('fighting') || g.includes('mmo') || g.includes('battle royale') || g.includes('shooter')) return 'Action';
      
      return 'Arcade';
    };

    // Grab all 350+ games the API returns
    const formattedGames = data.slice(0, 360).map(g => ({
      id: g.id.toString(),
      title: g.title,
      description: g.short_description,
      category: mapCategory(g.genre, g.title),
      coverUrl: g.thumbnail.replace('http:', 'https:'),
      rating: Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
      isWebGame: g.platform.includes('Web Browser') || Math.random() > 0.5,
      gameUrl: "https://html5.gamedistribution.com/rvvASMiM6KXzbfYALxyBPd0raxZ6vd9SV/",
      downloadUrl: g.game_url
    }));

    const fileContent = `export const gamesData = ${JSON.stringify(formattedGames, null, 2)};\n`;
    fs.writeFileSync('src/data/games.js', fileContent);
    console.log(`Successfully generated ${formattedGames.length} games with REAL pictures!`);
  })
  .catch(err => console.error("Error:", err.message));
