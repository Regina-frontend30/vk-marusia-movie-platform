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

        if (
            !formValues.email.trim() ||
            !formValues.password.trim()
        ) {
            return;
        }

        setLoading(true);

        try {
            if (mode === "login") {
                await login(
                    formValues.email,
                    formValues.password,
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
                    !formValues.firstName.trim() ||
                    !formValues.lastName.trim() ||
                    !formValues.passwordConfirm.trim()
                ) {
                    setError("Заполните все поля регистрации");
                    return;
                }

                if (
                    formValues.password !==
                    formValues.passwordConfirm
                ) {
                    setError("Пароли не совпадают");
                    return;
                }

                await register({
                    email: formValues.email,
                    password: formValues.password,
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
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
        formValues,
        setFormField,
        goLogin,
        goRegister,
        onSubmit,
    };
}
