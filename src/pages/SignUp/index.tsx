import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/index.ts";
import backgroundImage from "../../assets/background.svg";
import logoImage from "../../assets/logo.svg";
import NotifyError from "../../utils/NotifyError.tsx";
import notify from "../../utils/notify.ts";
import styles from "./styles.module.scss";
import { DataFormSignUpTypes } from "../../types/dataFormSignUpTypes.ts";

export default function SignUp() {
  const navigate = useNavigate();

  const [signUpFormInfo, setSignUpFormInfo] = useState<DataFormSignUpTypes>({
    name: "",
    email: "",
    firstPassword: "",
    secodPassword: "",
  });

  const handleChangeForm = (event: ChangeEvent<HTMLInputElement>) => {
    setSignUpFormInfo({
      ...signUpFormInfo,
      [event.target.name]: event.target.value,
    });
  };

  const submitFormSignUp = async (event: FormEvent) => {
    try {
      event.preventDefault();

      if (signUpFormInfo.firstPassword !== signUpFormInfo.secodPassword) {
        return notify("As duas senhas devem ser iguais", "info");
      }

      const dataInfoSignUp = {
        nome: signUpFormInfo.name,
        email: signUpFormInfo.email,
        senha: signUpFormInfo.firstPassword,
      };

      await api.post("/usuario", { ...dataInfoSignUp });
      navigate("/signIn");
    } catch (error) {
      NotifyError(error);
    }
  };

  return (
    <div
      className={styles.containerSignUp}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.imgLogoSignUp}>
        <img src={logoImage} alt="Imagem Logo" />
      </div>

      <div className={styles.formSize}>
        <form className={styles.formSignUp} onSubmit={submitFormSignUp}>
          <h1 className={styles.titleSignUp}>Cadastre-se</h1>

          <div className={styles.inputSignUp}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              value={signUpFormInfo.name}
              onChange={handleChangeForm}
              required
            />
          </div>

          <div className={styles.inputSignUp}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              value={signUpFormInfo.email}
              onChange={handleChangeForm}
              required
            />
          </div>

          <div className={styles.inputSignUp}>
            <label htmlFor="firstPassword">Senha</label>
            <input
              type="password"
              name="firstPassword"
              id="firstPassword"
              value={signUpFormInfo.firstPassword}
              onChange={handleChangeForm}
              required
            />
          </div>

          <div className={styles.inputSignUp}>
            <label htmlFor="secodPassword">Confirmar Senha</label>
            <input
              type="password"
              name="secodPassword"
              id="secodPassword"
              value={signUpFormInfo.secodPassword}
              onChange={handleChangeForm}
              required
            />
          </div>

          <button type="submit">Cadastrar</button>

          <Link to="/signIn">Já tem cadastro? Clique aqui!</Link>
        </form>
      </div>
    </div>
  );
}
