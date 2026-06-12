const fs = require('fs');

async function generateAllGames() {
  try {
    // 1. Fetch Casual HTML5 Games (GameDistribution) - 5 pages of 100 each = 500 games
    console.log('Fetching 500 casual games from GameDistribution (5 pages)...');
    const gdPages = await Promise.all([1, 2, 3, 4, 5].map(page =>
      fetch(`https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&type=all&amount=100&page=${page}&format=json`)
        .then(r => r.json())
        .catch(() => [])
    ));
    const gdGamesList = gdPages.flat().filter(g => g && g.Md5 && g.Title && g.Url);
    // Deduplicate by Md5
    const uniqueGd = Array.from(new Map(gdGamesList.map(g => [g.Md5, g])).values());
    console.log(`Got ${uniqueGd.length} unique casual games.`);
    
    const mapGdCategory = (tags) => {
      const t = tags.join(' ').toLowerCase();
      if (t.includes('card') || t.includes('solitaire') || t.includes('poker')) return 'Cards';
      if (t.includes('bubble') || t.includes('shoot')) {
        if (t.includes('bubble') || t.includes('match')) return 'Bubble Shooters';
      }
      if (t.includes('puzzle') || t.includes('match 3') || t.includes('mahjong') || t.includes('brain') || t.includes('board')) return 'Puzzle';
      if (t.includes('strategy') || t.includes('tower defense')) return 'Strategy';
      if (t.includes('action') || t.includes('fighting') || t.includes('adventure')) return 'Action';
      return 'Arcade';
    };

    const casualGames = uniqueGd.map(g => ({
      id: g.Md5 || Math.random().toString(36).substr(2, 9),
      title: g.Title,
      description: (g.Description || "No description available.").replace(/<\/?[^>]+(>|$)/g, "").substr(0, 150) + "...",
      category: mapGdCategory(g.Tag || g.Category || []),
      coverUrl: (g.Asset && g.Asset[0]) ? g.Asset[0] : "https://gamedistribution.com/images/logo.png",
      rating: Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
      isWebGame: true,
      gameUrl: g.Url || "https://html5.gamedistribution.com/rvvASMiM6KXzbfYALxyBPd0raxZ6vd9SV/", 
      downloadUrl: g.Url
    }));

    // 2. Fetch Hardcore PC Games (FreeToGame)
    const ftgRes = await fetch('https://www.freetogame.com/api/games');
    const ftgData = await ftgRes.json();

    const mapFtgCategory = (genre, title) => {
      const g = genre.toLowerCase();
      const t = title.toLowerCase();
      
      if (g.includes('card')) return 'Cards';
      if (t.includes('bubble')) return 'Bubble Shooters';
      if (g.includes('puzzle') || g.includes('board') || g.includes('trivia') || t.includes('match')) return 'Puzzle';
      if (g.includes('strategy') || g.includes('moba') || g.includes('rts') || g.includes('turn-based')) return 'Strategy';
      if (g.includes('action') || g.includes('fighting') || g.includes('mmo') || g.includes('battle royale') || g.includes('shooter')) return 'Action';
      return 'Arcade';
    };

    const popularTitles = ['overwatch 2', 'apex legends', 'pubg', 'world of warcraft', 'genshin impact', 'valorant', 'lost ark', 'smite', 'warframe', 'destiny 2', 'path of exile', 'halo infinite'];

    const hardcoreGames = ftgData.slice(0, 360).map(g => {
      const isPop = popularTitles.some(pt => g.title.toLowerCase().includes(pt));
      const isWeb = g.platform.toLowerCase().includes('web browser');
      return {
        id: g.id.toString(),
        title: g.title,
        description: (g.short_description || "").replace(/<\/?[^>]+(>|$)/g, "").substr(0, 150) + "...",
        category: mapFtgCategory(g.genre, g.title),
        coverUrl: g.thumbnail.replace('http:', 'https:'),
        rating: isPop ? Number((Math.random() * (5 - 4.7) + 4.7).toFixed(1)) : Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
        isWebGame: isWeb,
        gameUrl: isWeb ? g.game_url : null,
        downloadUrl: g.game_url,
        isPopular: isPop
      };
    });

    // 3. Merge them and shuffle slightly
    const allGames = [...casualGames, ...hardcoreGames].sort(() => Math.random() - 0.5);

    const fileContent = `export const gamesData = ${JSON.stringify(allGames, null, 2)};\n`;
    fs.writeFileSync('src/data/games.js', fileContent);
    console.log(`Successfully generated ${allGames.length} games (Blended Casual & Hardcore)!`);
  } catch (err) {
    console.error("Error generating games:", err.message);
  }
}

generateAllGames();
