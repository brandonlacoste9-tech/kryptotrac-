import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "games": "Games",
        "categories": "Categories",
        "about": "About",
        "login": "Log In",
        "signup": "Sign Up",
        "logout": "Log Out",
        "gopro": "Go Pro",
        "hello": "Hello"
      },
      "hero": {
        "badge": "New Platform 🎮",
        "title1": "Level Up Your",
        "title2": "Gaming Experience",
        "subtitle": "Discover, play, and distribute the next generation of indie hits and blockbuster titles. Welcome to Hell Yeah Games.",
        "start": "Start Playing",
        "explore": "Explore Catalog",
        "stat_games": "Games",
        "stat_players": "Players",
        "stat_rating": "Rating"
      }
    }
  },
  es: {
    translation: {
      "nav": {
        "home": "Inicio",
        "games": "Juegos",
        "categories": "Categorías",
        "about": "Acerca de",
        "login": "Iniciar sesión",
        "signup": "Regístrate",
        "logout": "Cerrar sesión",
        "gopro": "Hazte Pro",
        "hello": "Hola"
      },
      "hero": {
        "badge": "Nueva Plataforma 🎮",
        "title1": "Sube de nivel tu",
        "title2": "Experiencia de Juego",
        "subtitle": "Descubre, juega y distribuye la próxima generación de éxitos independientes. Bienvenido a Hell Yeah Games.",
        "start": "Empezar a Jugar",
        "explore": "Explorar Catálogo",
        "stat_games": "Juegos",
        "stat_players": "Jugadores",
        "stat_rating": "Valoración"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "home": "Accueil",
        "games": "Jeux",
        "categories": "Catégories",
        "about": "À propos",
        "login": "Connexion",
        "signup": "S'inscrire",
        "logout": "Déconnexion",
        "gopro": "Devenir Pro",
        "hello": "Bonjour"
      },
      "hero": {
        "badge": "Nouvelle Plateforme 🎮",
        "title1": "Améliorez votre",
        "title2": "Expérience de Jeu",
        "subtitle": "Découvrez, jouez et distribuez la prochaine génération de succès. Bienvenue dans Hell Yeah Games.",
        "start": "Commencer à Jouer",
        "explore": "Explorer le Catalogue",
        "stat_games": "Jeux",
        "stat_players": "Joueurs",
        "stat_rating": "Évaluation"
      }
    }
  },
  pt: {
    translation: {
      "nav": {
        "home": "Início",
        "games": "Jogos",
        "categories": "Categorias",
        "about": "Sobre",
        "login": "Entrar",
        "signup": "Inscrever-se",
        "logout": "Sair",
        "gopro": "Seja Pro",
        "hello": "Olá"
      },
      "hero": {
        "badge": "Nova Plataforma 🎮",
        "title1": "Eleve a sua",
        "title2": "Experiência de Jogo",
        "subtitle": "Descubra, jogue e distribua a próxima geração de sucessos. Bem-vindo ao Hell Yeah Games.",
        "start": "Começar a Jogar",
        "explore": "Explorar Catálogo",
        "stat_games": "Jogos",
        "stat_players": "Jogadores",
        "stat_rating": "Avaliação"
      }
    }
  },
  it: {
    translation: {
      "nav": {
        "home": "Home",
        "games": "Giochi",
        "categories": "Categorie",
        "about": "Chi siamo",
        "login": "Accedi",
        "signup": "Iscriviti",
        "logout": "Esci",
        "gopro": "Diventa Pro",
        "hello": "Ciao"
      },
      "hero": {
        "badge": "Nuova Piattaforma 🎮",
        "title1": "Migliora la tua",
        "title2": "Esperienza di Gioco",
        "subtitle": "Scopri, gioca e distribuisci la prossima generazione di successi. Benvenuto in Hell Yeah Games.",
        "start": "Inizia a Giocare",
        "explore": "Esplora Catalogo",
        "stat_games": "Giochi",
        "stat_players": "Giocatori",
        "stat_rating": "Valutazione"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "home": "मुख्य पृष्ठ",
        "games": "खेल",
        "categories": "श्रेणियाँ",
        "about": "हमारे बारे में",
        "login": "लॉग इन करें",
        "signup": "साइन अप करें",
        "logout": "लॉग आउट",
        "gopro": "प्रो बनें",
        "hello": "नमस्ते"
      },
      "hero": {
        "badge": "नया प्लेटफॉर्म 🎮",
        "title1": "अपना गेमिंग",
        "title2": "अनुभव बेहतर करें",
        "subtitle": "अगली पीढ़ी के इंडी हिट्स खोजें और खेलें। द आर्केड में आपका स्वागत है।",
        "start": "खेलना शुरू करें",
        "explore": "कैटलॉग देखें",
        "stat_games": "खेल",
        "stat_players": "खिलाड़ी",
        "stat_rating": "रेटिंग"
      }
    }
  },
  pa: {
    translation: {
      "nav": {
        "home": "ਮੁੱਖ ਪੰਨਾ",
        "games": "ਖੇਡਾਂ",
        "categories": "ਸ਼੍ਰੇਣੀਆਂ",
        "about": "ਸਾਡੇ ਬਾਰੇ",
        "login": "ਲਾਗਿਨ ਕਰੋ",
        "signup": "ਸਾਈਨ ਅੱਪ ਕਰੋ",
        "logout": "ਲਾਗਆਉਟ",
        "gopro": "ਪ੍ਰੋ ਬਣੋ",
        "hello": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ"
      },
      "hero": {
        "badge": "ਨਵਾਂ ਪਲੇਟਫਾਰਮ 🎮",
        "title1": "ਆਪਣਾ ਗੇਮਿੰਗ",
        "title2": "ਤਜਰਬਾ ਬਿਹਤਰ ਕਰੋ",
        "subtitle": "ਅਗਲੀ ਪੀੜ੍ਹੀ ਦੀਆਂ ਗੇਮਾਂ ਖੋਜੋ ਅਤੇ ਖੇਡੋ। ਦਿ ਆਰਕੇਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।",
        "start": "ਖੇਡਣਾ ਸ਼ੁਰੂ ਕਰੋ",
        "explore": "ਕੈਟਾਲਾਗ ਦੇਖੋ",
        "stat_games": "ਖੇਡਾਂ",
        "stat_players": "ਖਿਡਾਰੀ",
        "stat_rating": "ਰੇਟਿੰਗ"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
