const BASE_URL = "https://cinemaguide.skillbox.cc";

export async function getRandomMovie() {
    const res = await fetch(`${BASE_URL}/movie/random`);

    if (!res.ok) {
        throw new Error("Ошибка загрузки фильма");
    }

    return res.json();
}

export async function getTopMovies() {
    const res = await fetch(`${BASE_URL}/movie/top10`);

    if (!res.ok) {
        throw new Error("Ошибка загрузки топа");
    }

    return res.json();
}