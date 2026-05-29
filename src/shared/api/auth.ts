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

        const message =
            typeof responseBody === "object" &&
                responseBody &&
                "message" in responseBody
                ? String(
                    (responseBody as { message?: unknown }).message ??
                    "Ошибка запроса",
                )
                : "Ошибка запроса";

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
    } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
            return null;
        }

        throw e;
    }
}

export async function logout() {
    await requestJson("/auth/logout", {
        method: "GET",
    });
}