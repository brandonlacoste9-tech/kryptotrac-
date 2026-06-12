fetch('https://www.freetogame.com/api/games')
  .then(res => res.json())
  .then(data => {
    console.log("FreeToGame sample:");
    console.log(data.slice(0, 2).map(g => ({title: g.title, img: g.thumbnail, genre: g.genre})));
  })
  .catch(err => console.error("FreeToGame Error:", err.message));
