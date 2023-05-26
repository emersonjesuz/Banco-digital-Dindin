import { clearItem, getItem } from "../../utils";
import logoIconBlack from "../../assets/Polygon 1.png";
import logoIconWhite from "../../assets/Polygon 2.png";
import iconProfile from "../../assets/perfil.png";
import iconClose from "../../assets/Vector (1).png";

export default function Header({ listTransaction, setShowUserModal }) {
  const name = getItem("name");
  return (
    <header>
      <div className="headerLogo">
        <div className="joinIcons">
          <img src={logoIconBlack} alt="logo" />
          <img id="logoWhite" src={logoIconWhite} alt="logo" />
        </div>
        <h1>Dindin</h1>
      </div>
      <div className="headerProfileOutput">
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
            clearItem();
            listTransaction();
          }}
        />
      </div>
    </header>
  );
}
