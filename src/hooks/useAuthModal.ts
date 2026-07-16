import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ApiError,
    login,
    register,
} from "../shared/api/auth";
import { useAuth } from "../app/providers/useAuth";

export type AuthMode =
    | "login"
    | "register"
    | "success";

type Props = {
    onClose: () => void;
};

type AuthFormValues = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    passwordConfirm: string;
};

type AuthFieldErrors = {
    email: boolean;
    password: boolean;
    firstName: boolean;
    lastName: boolean;
    passwordConfirm: boolean;
};

type SubmitHandlerArgs = {
    mode: AuthMode;
    formValues: AuthFormValues;
    fieldErrors: AuthFieldErrors;
    setSubmitted: (value: boolean) => void;
    setError: (value: string | null) => void;
    setLoading: (value: boolean) => void;
    refreshUser: () => Promise<void>;
    onClose: () => void;
    navigate: ReturnType<typeof useNavigate>;
    setMode: (mode: AuthMode) => void;
};

function hasValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function hasValidName(name: string) {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && /^[A-Za-zА-Яа-яЁё -]+$/u.test(trimmedName);
}

function hasLoginPassword(password: string) {
    return Boolean(password.trim());
}

function hasStrongPassword(password: string) {
    const trimmedPassword = password.trim();
    return trimmedPassword.length >= 6 && /[A-Za-zА-Яа-яЁё]/u.test(trimmedPassword) && /\d/.test(trimmedPassword);
}

function hasMatchingPasswords(formValues: AuthFormValues) {
    return Boolean(formValues.passwordConfirm.trim()) && formValues.password === formValues.passwordConfirm;
}

function getAuthFieldErrors(args: {
    mode: AuthMode;
    formValues: AuthFormValues;
}): AuthFieldErrors {
    const isRegisterMode = args.mode === "register";
    return {
        email: !hasValidEmail(args.formValues.email),
        password: isRegisterMode ? !hasStrongPassword(args.formValues.password) : !hasLoginPassword(args.formValues.password),
        firstName: isRegisterMode && !hasValidName(args.formValues.firstName),
        lastName: isRegisterMode && !hasValidName(args.formValues.lastName),
        passwordConfirm: isRegisterMode && !hasMatchingPasswords(args.formValues),
    };
}

function getValidationErrorMessage(args: {
    mode: AuthMode;
    fieldErrors: AuthFieldErrors;
}) {
    if (args.fieldErrors.email) return "Введите корректную электронную почту";
    if (args.fieldErrors.password) return args.mode === "register" ? "Пароль должен быть не короче 6 символов и содержать буквы и цифры" : "Введите пароль";
    if (args.fieldErrors.firstName || args.fieldErrors.lastName) return "Имя и фамилия должны содержать не менее 2 букв";
    if (args.fieldErrors.passwordConfirm) return "Пароли не совпадают";
    return null;
}

function createRegisterPayload(formValues: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    return {
        email: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
    };
}

async function submitLogin(args: {
    email: string;
    password: string;
    refreshUser: () => Promise<void>;
    onClose: () => void;
    navigate: ReturnType<typeof useNavigate>;
}) {
    await login(args.email, args.password);
    await args.refreshUser();
    args.onClose();
    args.navigate("/account", { replace: true });
}

async function submitRegister(args: {
    formValues: AuthFormValues;
    setMode: (mode: AuthMode) => void;
}) {
    await register(createRegisterPayload(args.formValues));
    args.setMode("success");
}

function handleAuthError(
    caughtError: unknown,
    setError: (message: string) => void,
) {
    console.error("AUTH ERROR:", caughtError);

    if (caughtError instanceof ApiError) {
        setError(caughtError.message || "Ошибка запроса");
        return;
    }

    setError("Не удалось связаться с сервером");
}

function resetSubmitState(args: {
    setSubmitted: (value: boolean) => void;
    setError: (value: string | null) => void;
}) {
    args.setSubmitted(true);
    args.setError(null);
}

async function submitAuthByMode(args: SubmitHandlerArgs) {
    if (args.mode === "login") {
        await submitLogin({ email: args.formValues.email, password: args.formValues.password, refreshUser: args.refreshUser, onClose: args.onClose, navigate: args.navigate });
        return;
    }

    if (args.mode === "register") {
        await submitRegister({ formValues: args.formValues, setMode: args.setMode });
    }
}

async function submitAuthForm(args: SubmitHandlerArgs) {
    resetSubmitState(args);
    const validationError = getValidationErrorMessage({ mode: args.mode, fieldErrors: args.fieldErrors });
    if (validationError) {
        args.setError(validationError);
        return;
    }
    args.setLoading(true);
    try {
        await submitAuthByMode(args);
    } catch (caughtError: unknown) {
        handleAuthError(caughtError, args.setError as (message: string) => void);
    } finally {
        args.setLoading(false);
    }
}

function createSubmitEventHandler(args: SubmitHandlerArgs) {
    return async function onSubmit(
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();
        await submitAuthForm(args);
    };
}

function useAuthFormState() {
    const [mode, setMode] =
        useState<AuthMode>("login");
    const [loading, setLoading] =
        useState(false);
    const [submitted, setSubmitted] =
        useState(false);
    const [error, setError] =
        useState<string | null>(null);
    const [formValues, setFormValues] = useState<AuthFormValues>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        passwordConfirm: "",
    });
    const setFormField = (field: string, value: string) =>
        setFormValues((prev) => ({ ...prev, [field]: value }));
    return { mode, setMode, loading, setLoading, submitted, setSubmitted, error, setError, formValues, setFormField, goLogin: () => setMode("login"), goRegister: () => setMode("register") };
}

function createSubmitHandler(args: SubmitHandlerArgs) {
    return createSubmitEventHandler(args);
}

export function useAuthModal({
    onClose,
}: Props) {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const formState = useAuthFormState();
    const fieldErrors = getAuthFieldErrors({ mode: formState.mode, formValues: formState.formValues });
    const onSubmit = createSubmitHandler({ mode: formState.mode, formValues: formState.formValues, fieldErrors, setSubmitted: formState.setSubmitted, setError: formState.setError, setLoading: formState.setLoading, refreshUser, onClose, navigate, setMode: formState.setMode });
    return { ...formState, fieldErrors, onSubmit };
}
