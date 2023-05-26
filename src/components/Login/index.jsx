import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./style.css";
import backgroundImage from "../../assets/background.svg";
import imgLogo from "../../assets/logo.svg";
import api from "../../api";
import { setItem } from "../../utils";

export default function Login() {
  const navigate = useNavigate();

  const [infoLogin, setInfoLogin] = useState({
    email: "",
    senha: "",
  });

  async function verifyLogin(event) {
    event.preventDefault();

    if (!infoLogin.email || !infoLogin.senha) return;

    const login = await api.post("/login", { ...infoLogin }).catch((erro) => {
      console.log(erro);
    });

    setItem("token", login.data.token);
    setItem("name", login.data.usuario.nome);
    navigate("/home");
  }

  const handleChangeForm = (event) => {
    setInfoLogin({ ...infoLogin, [event.target.name]: event.target.value });
  };

  return (
    <div
      className="containerLogin"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      alt="imagem de fundo"
    >
      <div className="logoBar">
        <img src={imgLogo} alt="logo Image" />
      </div>

      <div className="loginContent">
        <div className="textLogin">
          <h1>
            Controle suas <span>finanças</span>, sem planilha chata.
          </h1>
          <h3>
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </h3>
          <button onClick={() => navigate("/signup")}>Cadastre-se</button>
        </div>

        <div className="formLogin">
          <h1>Login</h1>

          <div className="inputLogin">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              value={infoLogin.email}
              onChange={(e) => handleChangeForm(e)}
              required
            />
          </div>

          <div className="inputLogin">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="senha"
              value={infoLogin.senha}
              onChange={(e) => handleChangeForm(e)}
              required
            />
          </div>

          <button
            onClick={(e) => {
              verifyLogin(e);
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
