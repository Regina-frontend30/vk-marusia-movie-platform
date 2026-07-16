import "./AuthModal.scss";
import logo from "../../assets/logo/logo.svg";

import { useAuthModal } from "../../hooks/useAuthModal";

type Props = {
  onClose: () => void;
};

type AuthModalController = ReturnType<typeof useAuthModal>;

type AuthModalMode = AuthModalController["mode"];

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

function AuthModalHeader() {
  return (
    <div className="auth-modal__header">
      <div className="auth-modal__logo-mark" aria-hidden="true">
        <img src={logo} alt="" className="auth-modal__logo" />
      </div>
      <span className="auth-modal__logo-text">маруся</span>
    </div>
  );
}

function AuthModalTitle({ mode }: { mode: AuthModalMode }) {
  return mode === "register" ? <div className="auth-modal__title">Регистрация</div> : null;
}

function AuthModalEmailField({
  submitted,
  fieldErrors,
  formValues,
  setFormField,
}: Pick<AuthModalController, "submitted" | "fieldErrors" | "formValues" | "setFormField">) {
  return (
    <FieldWrapper hasError={submitted && fieldErrors.email}>
      <input className="auth-modal__input" type="email" placeholder="Электронная почта" value={formValues.email} onChange={(event) => setFormField("email", event.target.value)} />
    </FieldWrapper>
  );
}

function AuthModalRegisterFields({ mode, submitted, fieldErrors, formValues, setFormField }: Pick<AuthModalController, "mode" | "submitted" | "fieldErrors" | "formValues" | "setFormField">) {
  if (mode !== "register") {
    return null;
  }

  return (
    <>
      <FieldWrapper hasError={submitted && fieldErrors.firstName}>
        <input className="auth-modal__input" type="text" placeholder="Имя" value={formValues.firstName} onChange={(event) => setFormField("firstName", event.target.value)} />
      </FieldWrapper>
      <FieldWrapper hasError={submitted && fieldErrors.lastName}>
        <input className="auth-modal__input" type="text" placeholder="Фамилия" value={formValues.lastName} onChange={(event) => setFormField("lastName", event.target.value)} />
      </FieldWrapper>
    </>
  );
}

function AuthModalPasswordField({
  submitted,
  fieldErrors,
  formValues,
  setFormField,
}: Pick<AuthModalController, "submitted" | "fieldErrors" | "formValues" | "setFormField">) {
  return (
    <FieldWrapper hasError={submitted && fieldErrors.password}>
      <input className="auth-modal__input" type="password" placeholder="Пароль" value={formValues.password} onChange={(event) => setFormField("password", event.target.value)} />
    </FieldWrapper>
  );
}

function AuthModalPasswordConfirmField({
  mode,
  submitted,
  fieldErrors,
  formValues,
  setFormField,
}: Pick<AuthModalController, "mode" | "submitted" | "fieldErrors" | "formValues" | "setFormField">) {
  if (mode !== "register") {
    return null;
  }

  return (
    <FieldWrapper hasError={submitted && fieldErrors.passwordConfirm}>
      <input className="auth-modal__input" type="password" placeholder="Подтвердите пароль" value={formValues.passwordConfirm} onChange={(event) => setFormField("passwordConfirm", event.target.value)} />
    </FieldWrapper>
  );
}

function getAuthSubmitLabel(mode: AuthModalMode, loading: boolean) {
  if (mode === "login") {
    return loading ? "Вход..." : "Войти";
  }

  return loading ? "Создание аккаунта..." : "Создать аккаунт";
}

function AuthModalSubmitButton({
  mode,
  loading,
}: Pick<AuthModalController, "mode" | "loading">) {
  return <button type="submit" className="auth-modal__primary" disabled={loading}>{getAuthSubmitLabel(mode, loading)}</button>;
}

function AuthModalFooter({
  mode,
  goLogin,
  goRegister,
}: Pick<AuthModalController, "mode" | "goLogin" | "goRegister">) {
  return (
    <div className="auth-modal__footer">
      {mode === "login" ? <button type="button" className="auth-modal__link" onClick={goRegister}>Регистрация</button> : <button type="button" className="auth-modal__link" onClick={goLogin}>У меня есть пароль</button>}
    </div>
  );
}

function AuthModalForm(authController: AuthModalController) {
  return (
    <form onSubmit={authController.onSubmit} className="auth-modal__form" noValidate>
      <AuthModalEmailField submitted={authController.submitted} fieldErrors={authController.fieldErrors} formValues={authController.formValues} setFormField={authController.setFormField} />
      <AuthModalRegisterFields mode={authController.mode} submitted={authController.submitted} fieldErrors={authController.fieldErrors} formValues={authController.formValues} setFormField={authController.setFormField} />
      <AuthModalPasswordField submitted={authController.submitted} fieldErrors={authController.fieldErrors} formValues={authController.formValues} setFormField={authController.setFormField} />
      <AuthModalPasswordConfirmField mode={authController.mode} submitted={authController.submitted} fieldErrors={authController.fieldErrors} formValues={authController.formValues} setFormField={authController.setFormField} />
      <AuthModalSubmitButton mode={authController.mode} loading={authController.loading} />
      {authController.error ? <div className="auth-modal__error" role="alert">{authController.error}</div> : null}
    </form>
  );
}

export default function AuthModal({ onClose }: Props) {
  const authController = useAuthModal({ onClose });
  return (
    <div className="auth-modal" role="dialog" aria-modal="true" data-mode={authController.mode}>
      <div className="auth-modal__overlay" onClick={onClose} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>×</button>
        <AuthModalHeader />
        <AuthModalTitle mode={authController.mode} />
        <AuthModalForm {...authController} />
        <AuthModalFooter mode={authController.mode} goLogin={authController.goLogin} goRegister={authController.goRegister} />
      </div>
    </div>
  );
}
