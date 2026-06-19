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

function isLoginFormInvalid(formValues: {
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

    if (registerError) {
        args.setError(registerError);
        return;
    }

    await register({
        email: args.formValues.email,
        password: args.formValues.password,
        firstName: args.formValues.firstName,
        lastName: args.formValues.lastName,
    });

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

export function useAuthModal({
    onClose,
}: Props) {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const [mode, setMode] =
        useState<AuthMode>("login");

    const [loading, setLoading] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        passwordConfirm: "",
    });

    function setFormField(
        field: string,
        value: string,
    ) {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function goLogin() {
        setMode("login");
    }

    function goRegister() {
        setMode("register");
    }

    async function onSubmit(
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();
        setSubmitted(true);
        setError(null);
        if (isLoginFormInvalid(formValues)) return;
        setLoading(true);
        try {
            if (mode === "login") {
                await submitLogin({ email: formValues.email, password: formValues.password, refreshUser, onClose, navigate });
                return;
            }

            if (mode === "register") {
                await submitRegister({ formValues, setError, setMode });
            }
        } catch (caughtError: unknown) {
            handleAuthError(caughtError, setError);
        } finally {
            setLoading(false);
        }
    }

    return {
        mode,
        loading,
        submitted,
        error,
        formValues,
        setFormField,
        goLogin,
        goRegister,
        onSubmit,
    };
}
