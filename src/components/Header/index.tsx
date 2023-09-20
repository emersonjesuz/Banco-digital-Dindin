import { clearItemLocalstore, getItemLocalStore } from "../../helpers/index.ts";
import logoIconBlack from "../../assets/Polygon 1.png";
import logoIconWhite from "../../assets/Polygon 2.png";
import iconProfile from "../../assets/perfil.png";
import iconClose from "../../assets/Vector (1).png";
import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.scss";

type Props = {
  listTransaction: () => void;
  setShowUserModal: Dispatch<SetStateAction<boolean>>;
};

export default function Header({ listTransaction, setShowUserModal }: Props) {
  const name = getItemLocalStore("name");
  return (
    <header>
      <div className={styles.headerLogo}>
        <div className={styles.joinIcons}>
          <img src={logoIconBlack} alt="logo" />
          <img id="logoWhite" src={logoIconWhite} alt="logo" />
        </div>
        <h1>Dindin</h1>
      </div>
      <div className={styles.headerProfileOutput}>
        <img
          id="imgProfile"
          onClick={() => {
            setShowUserModal(true);
          }}
          src={iconProfile}
          alt="perfil"
        />

        <span>{name}</span>
        <img
          src={iconClose}
          alt="icone de sair"
          onClick={() => {
            clearItemLocalstore();
            listTransaction();
          }}
        />
      </div>
    </header>
  );
}
