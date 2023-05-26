import "./style.css";
import iconClose from "../../../assets/+.png";
import api from "../../../api";
import { useEffect, useState } from "react";
import { clearItem, getItem, setItem } from "../../../utils";
import { useNavigate } from "react-router-dom";

export default function UserEditModal({ setShowUserModal, showUserModal }) {
  const [formUserData, setFormUserData] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [showMessage, setShowMessage] = useState("");
  const navegate = useNavigate();
  const token = getItem("token");

  async function loginUserData() {
    if (!token) return;
    const dadosDeLogin = await api
      .get("/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => {
        navegate("/login");
        clearItem();
      });

    setFormUserData({ ...dadosDeLogin.data, name: dadosDeLogin.data.nome });
  }

  function userForm(e) {
    setFormUserData({
      ...formUserData,
      [e.target.name]: e.target.value,
    });
  }

  async function updateUser() {
    const { name, email, password1, password2 } = formUserData;

    const checkedForm = name && email && password1 && password2;

    if (!checkedForm) {
      return setShowMessage("preencha todos os campos!");
    }

    if (password1 !== password2) {
      return;
    }

    const editUser = {
      nome: name,
      email,
      senha: password1,
    };

    const user = await api
      .put(
        "/usuario",
        { ...editUser },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch(() => {
        setShowMessage("email ja existe!");
      });

    if (!user) {
      return setShowMessage("email ja existe!");
    }

    setShowUserModal(false);
    setItem("name", editUser.nome);
  }

  useEffect(() => {
    loginUserData();
  }, [showUserModal]);

  return (
    <div className="containerModal">
      <div className="userModalBox">
        <div className="userModalTitle">
          <h2>Editar Perfil</h2>
          <img
            onClick={() => setShowUserModal(false)}
            src={iconClose}
            alt="butao de  sair"
          />
        </div>
        <form
          className="formModalUser"
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
          <div>
            <label htmlFor="name">Nome</label>
            <input
              name="name"
              value={formUserData.name}
              type="text"
              onChange={(e) => userForm(e)}
            />
          </div>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              name="email"
              value={formUserData.email}
              type="email"
              onChange={(e) => userForm(e)}
            />
          </div>
          <div>
            <label htmlFor="password1">Senha</label>
            <input
              id="password1"
              name="password1"
              type="password"
              value={formUserData.password1 ? formUserData.password1 : ""}
              onChange={(e) => userForm(e)}
            />
          </div>
          <div>
            <label htmlFor="password2">Confirmação de senha</label>
            <input
              id="password2"
              name="password2"
              type="password"
              value={formUserData.password2 ? formUserData.password2 : ""}
              onChange={(e) => userForm(e)}
            />
          </div>
          <span>{showMessage}</span>
          <div className="BtnUserModalConfirm">
            <button>Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
