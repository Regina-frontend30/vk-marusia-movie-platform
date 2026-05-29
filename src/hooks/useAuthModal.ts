import { useState } from "react";

import {
    login,
    register,
} from "../shared/api/auth";

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
    const [mode, setMode] =
        useState<AuthMode>("login");

    const [loading, setLoading] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);

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

                onClose();
            }

            if (mode === "register") {
                await register({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                });

                setMode("success");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        mode,
        loading,
        submitted,
        values,
        setField,
        goLogin,
        goRegister,
        onSubmit,
    };
}