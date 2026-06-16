import "./AuthModal.scss";
import logo from "../../assets/logo/logo.svg";

import { useAuthModal } from "../../hooks/useAuthModal";

type Props = {
  onClose: () => void;
};

function FieldWrapper({
  children,
  hasError,
}: {
  children: React.ReactNode;
  hasError: boolean;
}) {
  return (
    <div
      className={
        hasError
          ? "auth-modal__field auth-modal__field--error"
          : "auth-modal__field"
      }
    >
      {children}
    </div>
  );
}

export default function AuthModal({ onClose }: Props) {
  const {
    mode,
    loading,
    submitted,
    error,
    formValues,
    setFormField,
    goLogin,
    goRegister,
    onSubmit,
  } = useAuthModal({ onClose });

  return (
    <div
      className="auth-modal"
      role="dialog"
      aria-modal="true"
      data-mode={mode}
    >
      <div className="auth-modal__overlay" onClick={onClose} />

      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>

        <div className="auth-modal__header">
          <img src={logo} alt="Маруся" className="auth-modal__logo" />
        </div>

        {mode === "register" && (
          <div className="auth-modal__title">Регистрация</div>
        )}

        <form onSubmit={onSubmit} className="auth-modal__form" noValidate>
          <FieldWrapper hasError={submitted && !formValues.email.trim()}>
            <input
              className="auth-modal__input"
              type="email"
              placeholder="Электронная почта"
              value={formValues.email}
              onChange={(event) => setFormField("email", event.target.value)}
            />
          </FieldWrapper>

          {mode === "register" && (
            <>
              <FieldWrapper hasError={submitted && !formValues.firstName.trim()}>
                <input
                  className="auth-modal__input"
                  type="text"
                  placeholder="Имя"
                  value={formValues.firstName}
                  onChange={(event) =>
                    setFormField("firstName", event.target.value)
                  }
                />
              </FieldWrapper>

              <FieldWrapper hasError={submitted && !formValues.lastName.trim()}>
                <input
                  className="auth-modal__input"
                  type="text"
                  placeholder="Фамилия"
                  value={formValues.lastName}
                  onChange={(event) =>
                    setFormField("lastName", event.target.value)
                  }
                />
              </FieldWrapper>
            </>
          )}

          <FieldWrapper hasError={submitted && !formValues.password.trim()}>
            <input
              className="auth-modal__input"
              type="password"
              placeholder="Пароль"
              value={formValues.password}
              onChange={(event) =>
                setFormField("password", event.target.value)
              }
            />
          </FieldWrapper>

          {mode === "register" && (
            <FieldWrapper
              hasError={submitted && !formValues.passwordConfirm.trim()}
            >
              <input
                className="auth-modal__input"
                type="password"
                placeholder="Подтвердите пароль"
                value={formValues.passwordConfirm}
                onChange={(event) =>
                  setFormField("passwordConfirm", event.target.value)
                }
              />
            </FieldWrapper>
          )}

          <button
            type="submit"
            className="auth-modal__primary"
            disabled={loading}
          >
            {mode === "login"
              ? loading
                ? "Вход..."
                : "Войти"
              : loading
                ? "Создание аккаунта..."
                : "Создать аккаунт"}
          </button>

          {error && (
            <div className="auth-modal__error" role="alert">
              {error}
            </div>
          )}
        </form>

        <div className="auth-modal__footer">
          {mode === "login" ? (
            <button
              type="button"
              className="auth-modal__link"
              onClick={goRegister}
            >
              Регистрация
            </button>
          ) : (
            <button
              type="button"
              className="auth-modal__link"
              onClick={goLogin}
            >
              У меня есть пароль
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
