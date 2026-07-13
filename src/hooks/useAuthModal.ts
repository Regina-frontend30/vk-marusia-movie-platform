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

type SubmitHandlerArgs = {
    mode: AuthMode;
    formValues: AuthFormValues;
    setSubmitted: (value: boolean) => void;
    setError: (value: string | null) => void;
    setLoading: (value: boolean) => void;
    refreshUser: () => Promise<void>;
    onClose: () => void;
    navigate: ReturnType<typeof useNavigate>;
    setMode: (mode: AuthMode) => void;
};

function hasEmptyAuthCredentials(formValues: {
    email: string;
    password: string;
}) {
    return (
        !formValues.email.trim() ||
        !formValues.password.trim()
    );
}

function hasEmptyRegisterFields(formValues: {
    firstName: string;
    lastName: string;
    passwordConfirm: string;
}) {
    return (
        !formValues.firstName.trim() ||
        !formValues.lastName.trim() ||
        !formValues.passwordConfirm.trim()
    );
}

function getRegisterError(formValues: {
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirm: string;
}) {
    if (hasEmptyRegisterFields(formValues)) {
        return "Заполните все поля регистрации";
    }

    if (
        formValues.password !==
        formValues.passwordConfirm
    ) {
        return "Пароли не совпадают";
    }

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
    formValues: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        passwordConfirm: string;
    };
    setError: (message: string) => void;
    setMode: (mode: AuthMode) => void;
}) {
    const registerError = getRegisterError(args.formValues);
    if (applyRegisterError(registerError, args.setError)) return;

    await register(createRegisterPayload(args.formValues));
    args.setMode("success");
}

function applyRegisterError(
    registerError: string | null,
    setError: (message: string) => void,
) {
    if (!registerError) {
        return false;
    }

    setError(registerError);
    return true;
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
        await submitRegister({ formValues: args.formValues, setError: args.setError as (message: string) => void, setMode: args.setMode });
    }
}

async function submitAuthForm(args: SubmitHandlerArgs) {
    resetSubmitState(args);
    if (hasEmptyAuthCredentials(args.formValues)) return;
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
    const onSubmit = createSubmitHandler({ mode: formState.mode, formValues: formState.formValues, setSubmitted: formState.setSubmitted, setError: formState.setError, setLoading: formState.setLoading, refreshUser, onClose, navigate, setMode: formState.setMode });
    return { ...formState, onSubmit };
}
