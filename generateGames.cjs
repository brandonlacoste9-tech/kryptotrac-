const fs = require('fs');

const baseGames = [
  {
    id: "2048",
    title: "2048",
    description: "Slide tiles to combine them and reach the elusive 2048 tile!",
    category: "Puzzle",
    coverUrl: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?q=80&w=1974&auto=format&fit=crop",
    rating: 4.8,
    isWebGame: true,
    gameUrl: "https://play2048.co/"
  },
  {
    id: "hextris",
    title: "Hextris",
    description: "A fast-paced puzzle game inspired by Tetris.",
    category: "Puzzle",
    coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    isWebGame: true,
    gameUrl: "https://hextris.io/"
  },
  {
    id: "cyber-ninja",
    title: "Cyber Ninja",
    description: "Slice through enemies in a dystopian future.",
    category: "Action",
    coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    isWebGame: false,
    downloadUrl: "#"
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird Clone",
    description: "The classic frustratingly addictive bird flying game.",
    category: "Arcade",
    coverUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
    rating: 4.5,
    isWebGame: true,
    gameUrl: "https://flappybird.io/"
  },
  {
    id: "pacman",
    title: "Pac-Man",
    description: "The classic arcade game. Eat dots and avoid ghosts!",
    category: "Arcade",
    coverUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1974&auto=format&fit=crop",
    rating: 4.9,
    isWebGame: true,
    gameUrl: "https://freepacman.org/"
  },
  {
    id: "mecha-brawl",
    title: "Mecha Brawl",
    description: "Arena-based combat with fully customizable giant robots.",
    category: "Action",
    coverUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop",
    rating: 4.4,
    isWebGame: false,
    downloadUrl: "#"
  }
];

const targetCategories = ["Action", "Strategy", "Puzzle", "Arcade"];
const generatedGames = [...baseGames];

for (const cat of targetCategories) {
  let count = generatedGames.filter(g => g.category === cat).length;
  let imgIndex = 0;
  const imagePool = [
    "https://images.unsplash.com/photo-1614294148960-9aa740632a87?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2065&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1984&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=2070&auto=format&fit=crop"
  ];
  
  while (count < 48) {
    generatedGames.push({
      id: `gen-${cat.toLowerCase()}-${count}`,
      title: `${cat} Game ${count + 1}`,
      description: `An amazing ${cat.toLowerCase()} experience. Get ready to play one of the best games in this genre!`,
      category: cat,
      coverUrl: imagePool[imgIndex % imagePool.length],
      rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      isWebGame: true,
      gameUrl: "https://hextris.io/"
    });
    count++;
    imgIndex++;
  }
}

const fileContent = `export const gamesData = ${JSON.stringify(generatedGames, null, 2)};\n`;
fs.writeFileSync('src/data/games.js', fileContent);
console.log('Successfully generated 48 games per category.');
