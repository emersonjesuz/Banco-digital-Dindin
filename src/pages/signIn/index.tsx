import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/index.ts";
import backgroundImage from "../../assets/background.svg";
import imgLogo from "../../assets/logo.svg";
import NotifyError from "../../utils/NotifyError.tsx";
import { setItemLocalStore } from "../../helpers/index.ts";
import notify from "../../utils/notify.ts";
import styles from "./styles.module.scss";

type FormSignInTypes = {
  email: string;
  password: string;
};

type SignInDataTypes = {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
};

export default function SignIn() {
  const navigate = useNavigate();

  const [infoSignIn, setInfoSignIn] = useState<FormSignInTypes>({
    email: "",
    password: "",
  });

  const handleChangeForm = (event: ChangeEvent<HTMLInputElement>) => {
    setInfoSignIn({ ...infoSignIn, [event.target.name]: event.target.value });
  };

  function formSecurityVerify(): boolean {
    const { email, password } = infoSignIn;
    if (!email || !password) {
      notify("Preencha todos os campos!", "info");
      return false;
    }

    if (password.length < 5) {
      notify("A senha precisa ter no minimo 5 caracteres", "info");
      return false;
    }

    return true;
  }

  async function verifySignIn(event: FormEvent) {
    event.preventDefault();

    const formSecurity = formSecurityVerify();

    if (!formSecurity) return;

    try {
      const dataInfoSignIn = {
        senha: infoSignIn.password,
        email: infoSignIn.email,
      };
      const signInData = await api.post<SignInDataTypes>("/login", {
        ...dataInfoSignIn,
      });
      setItemLocalStore("token", signInData.data.token);
      setItemLocalStore("name", signInData.data.usuario.nome);
      navigate("/main");
    } catch (error) {
      NotifyError(error);
    }
  }

  return (
    <div
      className={styles.containerLogin}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.logoBar}>
        <img src={imgLogo} alt="logo Image" />
        <button onClick={() => navigate("/signUp")}>Cadastre-se</button>
      </div>

      <div className={styles.loginContent}>
        <div className={styles.textLogin}>
          <h1>
            Controle suas <span>finanças</span>, sem planilha chata.
          </h1>
          <h3>
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </h3>
          <button onClick={() => navigate("/signUp")}>Cadastre-se</button>
        </div>

        <form className={styles.formLogin} onSubmit={verifySignIn}>
          <h1>Login</h1>

          <div className={styles.contentInput}>
            <div className={styles.inputLogin}>
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                value={infoSignIn.email}
                onChange={handleChangeForm}
                required
              />
            </div>
            <div className={styles.inputLogin}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={infoSignIn.password}
                onChange={handleChangeForm}
                required
              />
            </div>
          </div>

          <button>Entrar</button>
        </form>
      </div>
    </div>
  );
}
