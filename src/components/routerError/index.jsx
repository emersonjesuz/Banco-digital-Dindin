import "./style.css";

export default function RouterError() {
  const img =
    "https://imprimirdesenhos.com.br/wp-content/uploads/2023/03/Naruto-triste-para-colorir.png";
  return (
    <div className="containerError">
      <div className="errorTitle">
        <h1>404</h1>
        <strong>...Ooops</strong>
        <span>NOT FOUND</span>
      </div>
      <div
        className="imgError"
        style={{ backgroundImage: `url(${img})` }}
      ></div>
    </div>
  );
}
