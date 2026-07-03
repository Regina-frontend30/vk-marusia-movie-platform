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

function AuthModalHeader() {
  return (
    <div className="auth-modal__header">
      <img src={logo} alt="Маруся" className="auth-modal__logo" />
    </div>
  );
}

function AuthModalTitle({ mode }: { mode: ReturnType<typeof useAuthModal>["mode"] }) {
  return mode === "register" ? <div className="auth-modal__title">Регистрация</div> : null;
}

function AuthModalEmailField({
  submitted,
  formValues,
  setFormField,
}: Pick<ReturnType<typeof useAuthModal>, "submitted" | "formValues" | "setFormField">) {
  return (
    <FieldWrapper hasError={submitted && !formValues.email.trim()}>
      <input className="auth-modal__input" type="email" placeholder="Электронная почта" value={formValues.email} onChange={(event) => setFormField("email", event.target.value)} />
    </FieldWrapper>
  );
}

function AuthModalRegisterFields({
  mode,
  submitted,
  formValues,
  setFormField,
}: Pick<ReturnType<typeof useAuthModal>, "mode" | "submitted" | "formValues" | "setFormField">) {
  if (mode !== "register") {
    return null;
  }

  return (
    <>
      <FieldWrapper hasError={submitted && !formValues.firstName.trim()}>
        <input className="auth-modal__input" type="text" placeholder="Имя" value={formValues.firstName} onChange={(event) => setFormField("firstName", event.target.value)} />
      </FieldWrapper>
      <FieldWrapper hasError={submitted && !formValues.lastName.trim()}>
        <input className="auth-modal__input" type="text" placeholder="Фамилия" value={formValues.lastName} onChange={(event) => setFormField("lastName", event.target.value)} />
      </FieldWrapper>
    </>
  );
}

function AuthModalPasswordField({
  submitted,
  formValues,
  setFormField,
}: Pick<ReturnType<typeof useAuthModal>, "submitted" | "formValues" | "setFormField">) {
  return (
    <FieldWrapper hasError={submitted && !formValues.password.trim()}>
      <input className="auth-modal__input" type="password" placeholder="Пароль" value={formValues.password} onChange={(event) => setFormField("password", event.target.value)} />
    </FieldWrapper>
  );
}

function AuthModalPasswordConfirmField({
  mode,
  submitted,
  formValues,
  setFormField,
}: Pick<ReturnType<typeof useAuthModal>, "mode" | "submitted" | "formValues" | "setFormField">) {
  if (mode !== "register") {
    return null;
  }

  return (
    <FieldWrapper hasError={submitted && !formValues.passwordConfirm.trim()}>
      <input className="auth-modal__input" type="password" placeholder="Подтвердите пароль" value={formValues.passwordConfirm} onChange={(event) => setFormField("passwordConfirm", event.target.value)} />
    </FieldWrapper>
  );
}

function getAuthSubmitLabel(mode: ReturnType<typeof useAuthModal>["mode"], loading: boolean) {
  if (mode === "login") {
    return loading ? "Вход..." : "Войти";
  }

  return loading ? "Создание аккаунта..." : "Создать аккаунт";
}

function AuthModalSubmitButton({
  mode,
  loading,
}: Pick<ReturnType<typeof useAuthModal>, "mode" | "loading">) {
  return <button type="submit" className="auth-modal__primary" disabled={loading}>{getAuthSubmitLabel(mode, loading)}</button>;
}

function AuthModalFooter({
  mode,
  goLogin,
  goRegister,
}: Pick<ReturnType<typeof useAuthModal>, "mode" | "goLogin" | "goRegister">) {
  return (
    <div className="auth-modal__footer">
      {mode === "login" ? <button type="button" className="auth-modal__link" onClick={goRegister}>Регистрация</button> : <button type="button" className="auth-modal__link" onClick={goLogin}>У меня есть пароль</button>}
    </div>
  );
}

function AuthModalForm(authModal: ReturnType<typeof useAuthModal>) {
  return (
    <form onSubmit={authModal.onSubmit} className="auth-modal__form" noValidate>
      <AuthModalEmailField submitted={authModal.submitted} formValues={authModal.formValues} setFormField={authModal.setFormField} />
      <AuthModalRegisterFields mode={authModal.mode} submitted={authModal.submitted} formValues={authModal.formValues} setFormField={authModal.setFormField} />
      <AuthModalPasswordField submitted={authModal.submitted} formValues={authModal.formValues} setFormField={authModal.setFormField} />
      <AuthModalPasswordConfirmField mode={authModal.mode} submitted={authModal.submitted} formValues={authModal.formValues} setFormField={authModal.setFormField} />
      <AuthModalSubmitButton mode={authModal.mode} loading={authModal.loading} />
      {authModal.error ? <div className="auth-modal__error" role="alert">{authModal.error}</div> : null}
    </form>
  );
}

export default function AuthModal({ onClose }: Props) {
  const authModal = useAuthModal({ onClose });
  return (
    <div className="auth-modal" role="dialog" aria-modal="true" data-mode={authModal.mode}>
      <div className="auth-modal__overlay" onClick={onClose} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>×</button>
        <AuthModalHeader />
        <AuthModalTitle mode={authModal.mode} />
        <AuthModalForm {...authModal} />
        <AuthModalFooter mode={authModal.mode} goLogin={authModal.goLogin} goRegister={authModal.goRegister} />
      </div>
    </div>
  );
}
