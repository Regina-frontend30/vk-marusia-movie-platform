const BASE_URL = "https://cinemaguide.skillbox.cc";
const ERROR_MESSAGE_KEYS = [
    "message",
    "error",
    "errorMessage",
    "detail",
] as const;

const STATUS_ERROR_MESSAGES: Record<number, string> = {
    400: "Некорректные данные запроса",
    401: "Неверный логин или пароль",
    403: "Доступ запрещён",
    404: "Ресурс не найден",
    409: "Пользователь с такой почтой уже существует",
};

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
    return (
        getStringErrorMessage(body) ??
        getObjectErrorMessage(body) ??
        getStatusErrorMessage(status)
    );
}

function getTrimmedString(value: unknown) {
    return typeof value === "string" && value.trim()
        ? value.trim()
        : null;
}

function findObjectErrorMessage(record: Record<string, unknown>) {
    for (const key of ERROR_MESSAGE_KEYS) {
        const message = getTrimmedString(record[key]);
        if (message) return message;
    }

    return null;
}

function getNestedArrayErrorMessage(errors: unknown) {
    if (!Array.isArray(errors) || errors.length === 0) {
        return null;
    }

    const firstError = errors[0];
    const stringMessage = getTrimmedString(firstError);
    if (stringMessage) return stringMessage;
    if (!firstError || typeof firstError !== "object") return null;
    return findObjectErrorMessage(firstError as Record<string, unknown>);
}

function getStringErrorMessage(body: unknown) {
    return getTrimmedString(body);
}

function getObjectErrorMessage(body: unknown) {
    if (!body || typeof body !== "object") {
        return null;
    }

    const record = body as Record<string, unknown>;
    return (
        findObjectErrorMessage(record) ??
        getNestedArrayErrorMessage(record.errors)
    );
}

function getServerErrorMessage() {
    return "Сервер недоступен. Попробуйте позже";
}

function isServerErrorStatus(status: number) {
    return [500, 502, 503, 504].includes(status);
}

function getStatusErrorMessage(status: number) {
    if (status in STATUS_ERROR_MESSAGES) {
        return STATUS_ERROR_MESSAGES[status];
    }

    return isServerErrorStatus(status)
        ? getServerErrorMessage()
        : "Ошибка запроса";
}

function throwApiError(responseBody: unknown, status: number): never {
    throw new ApiError({
        message: extractErrorMessage(responseBody, status),
        status,
        data: responseBody,
    });
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
        throwApiError(responseBody, response.status);
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
