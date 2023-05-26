import React, { useState } from "react";
import "./style.css";
import backgroundImage from "../../assets/background.svg";
import logoImage from "../../assets/logo.svg";
import api from "./../../api/index";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmacaoSenha: "",
  });

  const submitForm = async (event) => {
    try {
      event.preventDefault();

      if (form.senha !== form.confirmacaoSenha) {
        return console.log("As duas senhas devem ser iguais");
      }

      await api.post("/usuario", form);
      navigate("/login");
    } catch (error) {
      return console.log(error);
    }
  };

  const handleChangeForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <div
      className="containerSignUp"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      alt="imagem de fundo"
    >
      <div className="imgLogoSignUp">
        <img src={logoImage} alt="Imagem Logo" />
      </div>

      <div className="formSize">
        <form className="formSignUp" action="submit" onSubmit={submitForm}>
          <h1 className="titleSignUp">Cadastre-se</h1>

          <div className="inputSignUp">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChangeForm}
              required
            />
          </div>

          <div className="inputSignUp">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChangeForm}
              required
            />
          </div>

          <div className="inputSignUp">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChangeForm}
              required
            />
          </div>

          <div className="inputSignUp">
            <label htmlFor="confirmacao-senha">Confirmação de senha</label>
            <input
              type="password"
              name="confirmacaoSenha"
              value={form.confirmacaoSenha}
              onChange={handleChangeForm}
              required
            />
          </div>

          <button type="submit">Cadastrar</button>

          <a href="/login">Já tem cadastro? Clique aqui!</a>
        </form>
      </div>
    </div>
  );
}
