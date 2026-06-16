const BASE_URL = "https://cinemaguide.skillbox.cc";

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(args: {
        message: string;
        status: number;
        data: unknown;
    }) {
        super(args.message);

        this.name = "ApiError";
        this.status = args.status;
        this.data = args.data;
    }
}

function extractErrorMessage(
    body: unknown,
    status: number,
): string {
    if (typeof body === "string" && body.trim()) {
        return body.trim();
    }

    if (body && typeof body === "object") {
        const obj = body as Record<string, unknown>;

        for (const key of [
            "message",
            "error",
            "errorMessage",
            "detail",
        ]) {
            const value = obj[key];

            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }
        }

        const nestedErrors = obj.errors;

        if (Array.isArray(nestedErrors) && nestedErrors.length > 0) {
            const first = nestedErrors[0];

            if (typeof first === "string" && first.trim()) {
                return first.trim();
            }

            if (first && typeof first === "object") {
                const firstObj = first as Record<string, unknown>;

                for (const key of [
                    "message",
                    "error",
                    "errorMessage",
                    "detail",
                ]) {
                    const value = firstObj[key];

                    if (typeof value === "string" && value.trim()) {
                        return value.trim();
                    }
                }
            }
        }
    }

    switch (status) {
        case 400:
            return "Некорректные данные запроса";
        case 401:
            return "Неверный логин или пароль";
        case 403:
            return "Доступ запрещён";
        case 404:
            return "Ресурс не найден";
        case 409:
            return "Пользователь с такой почтой уже существует";
        case 500:
        case 502:
        case 503:
        case 504:
            return "Сервер недоступен. Попробуйте позже";
        default:
            return "Ошибка запроса";
    }
}

async function readJsonSafe(response: Response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function readTextSafe(response: Response) {
    try {
        return await response.text();
    } catch {
        return null;
    }
}

async function readResponseBody(response: Response) {
    const contentType = response.headers.get("content-type") ?? "";

    return contentType.includes("application/json")
        ? readJsonSafe(response)
        : readTextSafe(response);
}

async function requestJson<T>(
    path: string,
    init?: RequestInit,
): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        credentials: "include",
        ...init,
    });

    if (!response.ok) {
        const responseBody = await readResponseBody(response);

        const message = extractErrorMessage(
            responseBody,
            response.status,
        );

        throw new ApiError({
            message,
            status: response.status,
            data: responseBody,
        });
    }

    return response.json() as Promise<T>;
}

export async function login(
    email: string,
    password: string,
) {
    return requestJson("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            email,
            password,
        }),
    });
}

export async function register(args: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    return requestJson("/user", {
        method: "POST",
        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            email: args.email,
            password: args.password,
            name: args.firstName,
            surname: args.lastName,
        }),
    });
}

export type Profile = {
    name: string;
    surname: string;
    email: string;
    favorites: string[];
};

export async function getProfile(): Promise<Profile | null> {
    try {
        return await requestJson<Profile>("/profile");
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }

        throw error;
    }
}

export async function logout() {
    await requestJson("/auth/logout", {
        method: "GET",
    });
}
