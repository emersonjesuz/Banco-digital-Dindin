import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./style.css";

export default function NotFoundPage() {
  const navegate = useNavigate();
  const img =
    "https://imprimirdesenhos.com.br/wp-content/uploads/2023/03/Naruto-triste-para-colorir.png";

  useEffect(() => {
    setTimeout(() => {
      navegate("/signIn");
    }, 3000);
  });

  return (
    <div className="containerError">
      <div className="errorTitle">
        <h1>404</h1>
        <strong>...Ooops</strong>
        <strong>NOT FOUND</strong>
        <span>você sera redirecionado em instantes...</span>
      </div>
      <div
        className="imgError"
        style={{ backgroundImage: `url(${img})` }}
      ></div>
    </div>
  );
}
