import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/index.ts";
import iconClose from "../../../assets/+.png";
import {
  clearItemLocalstore,
  getItemLocalStore,
  setItemLocalStore,
} from "../../../helpers/index.ts";
import { DataFormSignUpTypes } from "../../../types/dataFormSignUpTypes.ts";
import styles from "./styles.module.scss";
import notify from "../../../utils/notify.ts";
import NotifyError from "../../../utils/NotifyError.tsx";

type Props = {
  setShowUserModal: Dispatch<SetStateAction<boolean>>;
  showUserModal: boolean;
};

export default function UserEditModal({
  setShowUserModal,
  showUserModal,
}: Props) {
  const [formUserData, setFormUserData] = useState<DataFormSignUpTypes>({
    name: "",
    email: "",
    firstPassword: "",
    secodPassword: "",
  });
  const [showMessage, setShowMessage] = useState("");
  const navegate = useNavigate();

  async function loginUserData() {
    const dadosDeLogin: any = await api.get("/usuario").catch(() => {
      navegate("/signIn");
      clearItemLocalstore();
    });

    setFormUserData({ ...dadosDeLogin.data, name: dadosDeLogin.data.nome });
  }

  function userForm(event: ChangeEvent<HTMLInputElement>) {
    setFormUserData({
      ...formUserData,
      [event.target.name]: event.target.value,
    });
  }

  async function updateUser() {
    const { name, email, firstPassword, secodPassword } = formUserData;

    const checkedForm = !name && !email && !firstPassword && !secodPassword;

    if (checkedForm) {
      notify("nome ou email deve ser preechido!", "info");
      return;
    }

    if (firstPassword !== secodPassword) {
      notify("as senhas precisa ser iguais !", "info");
      return;
    }

    const editUser = {
      nome: name,
      email,
      senha: firstPassword,
    };
    try {
      await api.put("/usuario", { ...editUser });
      setShowUserModal(false);
      notify("Usuario atualizado com sucesso!", "success");
      setItemLocalStore("name", editUser.nome);
    } catch (error) {
      NotifyError(error);
    }
  }

  useEffect(() => {
    loginUserData();
  }, [showUserModal]);

  return (
    <div className={styles.containerModal}>
      <div className={styles.userModalBox}>
        <div className={styles.userModalTitle}>
          <h2>Editar Perfil</h2>
          <img
            onClick={() => setShowUserModal(false)}
            src={iconClose}
            alt="butao de  sair"
          />
        </div>
        <form
          className={styles.formModalUser}
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
            <label htmlFor="firstPassword">Senha</label>
            <input
              id="firstPassword"
              name="firstPassword"
              type="password"
              value={
                formUserData.firstPassword ? formUserData.firstPassword : ""
              }
              onChange={(e) => userForm(e)}
            />
          </div>
          <div>
            <label htmlFor="secodPassword">Confirmação de senha</label>
            <input
              id="secodPassword"
              name="secodPassword"
              type="password"
              value={
                formUserData.secodPassword ? formUserData.secodPassword : ""
              }
              onChange={(e) => userForm(e)}
            />
          </div>
          <span>{showMessage}</span>
          <div className={styles.BtnUserModalConfirm}>
            <button>Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
