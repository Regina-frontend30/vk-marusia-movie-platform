export type Movie = {
  id: number;
  title: string;
  image: string;
  rating: number;
  description: string;
  year: number;
  genre: string;
  runtime: string;
};

export const movies: Movie[] = [
  {
    id: 1,
    title: "Воздух",
    image: "/src/assets/images/home.png",
    rating: 7.5,
    description: "История молодых летчиц во время войны.",
    year: 2023,
    genre: "драма",
    runtime: "2 ч 30 мин",
  },
  {
    id: 2,
    title: "Шерлок Холмс",
    image: "/src/assets/images/home.png",
    rating: 8.2,
    description: "Приключения легендарного детектива.",
    year: 1979,
    genre: "детектив",
    runtime: "1 ч 7 мин",
  },
  {
    id: 3,
    title: "Интерстеллар",
    image: "/src/assets/images/home.png",
    rating: 8.6,
    description: "Путешествие сквозь космос и время.",
    year: 2014,
    genre: "фантастика",
    runtime: "2 ч 49 мин",
  },
  {
    id: 4,
    title: "Джокер",
    image: "/src/assets/images/home.png",
    rating: 8.0,
    description: "История становления злодея.",
    year: 2019,
    genre: "триллер",
    runtime: "2 ч 2 мин",
  },
  {
    id: 5,
    title: "Начало",
    image: "/src/assets/images/home.png",
    rating: 8.8,
    description: "Мир снов и подсознания.",
    year: 2010,
    genre: "фантастика",
    runtime: "2 ч 28 мин",
  },
  {
    id: 6,
    title: "Матрица",
    image: "/src/assets/images/home.png",
    rating: 8.7,
    description: "Реальность не то, чем кажется.",
    year: 1999,
    genre: "боевик",
    runtime: "2 ч 16 мин",
  },
  {
    id: 7,
    title: "Титаник",
    image: "/src/assets/images/home.png",
    rating: 7.9,
    description: "История любви на фоне катастрофы.",
    year: 1997,
    genre: "мелодрама",
    runtime: "3 ч 14 мин",
  },
  {
    id: 8,
    title: "Аватар",
    image: "/src/assets/images/home.png",
    rating: 7.8,
    description: "Путешествие на планету Пандора.",
    year: 2009,
    genre: "фантастика",
    runtime: "2 ч 42 мин",
  },
  {
    id: 9,
    title: "Форрест Гамп",
    image: "/src/assets/images/home.png",
    rating: 8.8,
    description: "История необычного человека.",
    year: 1994,
    genre: "драма",
    runtime: "2 ч 22 мин",
  },
  {
    id: 10,
    title: "Гладиатор",
    image: "/src/assets/images/home.png",
    rating: 8.5,
    description: "История римского генерала.",
    year: 2000,
    genre: "история",
    runtime: "2 ч 35 мин",
  },
];