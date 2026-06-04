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

    const [values, setValues] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        passwordConfirm: "",
    });

    function setField(
        field: string,
        value: string,
    ) {
        setValues((prev) => ({
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

        if (
            !values.email.trim() ||
            !values.password.trim()
        ) {
            return;
        }

        setLoading(true);

        try {
            if (mode === "login") {
                await login(
                    values.email,
                    values.password,
                );

                await refreshUser();
                onClose();
                navigate("/account", {
                    replace: true,
                });
                return;
            }

            if (mode === "register") {
                if (
                    !values.firstName.trim() ||
                    !values.lastName.trim() ||
                    !values.passwordConfirm.trim()
                ) {
                    setError("Заполните все поля регистрации");
                    return;
                }

                if (
                    values.password !==
                    values.passwordConfirm
                ) {
                    setError("Пароли не совпадают");
                    return;
                }

                await register({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                });

                setMode("success");
            }
        } catch (caughtError: unknown) {
            console.error("AUTH ERROR:", caughtError);

            if (caughtError instanceof ApiError) {
                setError(
                    caughtError.message || "Ошибка запроса",
                );
                return;
            }

            setError("Не удалось связаться с сервером");
        } finally {
            setLoading(false);
        }
    }

    return {
        mode,
        loading,
        submitted,
        error,
        values,
        setField,
        goLogin,
        goRegister,
        onSubmit,
    };
}
