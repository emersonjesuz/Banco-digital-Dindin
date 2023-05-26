import "./style.css";
import { useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";
import { getItem } from "../../../utils";
import iconClose from "../../../assets/+.png";
import api from "../../../api";

export default function TransactionModal({
  setDisplayTransaction,
  toggleInputOutput,
  setToggleInputOutput,
  transactionForm,
  setTransactionForm,
  listTransaction,
}) {
  const [categories, setCategories] = useState([]);
  const [showMessage, setShowMessage] = useState("");
  const token = getItem("token");

  async function listCategoriApi() {
    const categoryData = await api
      .get(`/categoria`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => setShowMessage("nenhuma categoria encontrada"));

    if (!categoryData.data) {
      return setShowMessage("nenhuma categoria encontrada");
    }

    setCategories(categoryData.data);
  }

  function fillingTransactionForm(e) {
    setTransactionForm({ ...transactionForm, [e.target.name]: e.target.value });
  }

  async function transact(type) {
    const { data, valor, categoria, descricao } = transactionForm;

    if (!valor || !categoria || !descricao) return;

    const transaction = {
      tipo: type,
      descricao,
      valor,
      data: data ? data : new Date(),
      categoria_id: categoria,
    };

    await api
      .post(
        "/transacao",
        { ...transaction },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch(() =>
        setShowMessage("Todos os campos obrigatórios devem ser informados")
      );

    listTransaction();

    setTransactionForm({
      valor: "",
      categoria: "",
      data: "",
      descricao: "",
    });
  }

  async function transactionUpdate(id) {
    const { descricao, valor, data, categoria, tipo } = transactionForm;

    const checkingForm =
      !descricao || !valor || data.length !== 10 || !categoria || !tipo || !id;

    if (checkingForm) return;

    const dateInvert = new Date(data.split("/").reverse().join("/"));

    const newTransactionUpdate = {
      descricao,
      valor,
      data: dateInvert,
      categoria_id: categoria,
      tipo,
    };

    await api
      .put(
        `/transacao/${id}`,
        {
          ...newTransactionUpdate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch(() => {
        setShowMessage("Todos os campos obrigatórios devem ser informados");
      });

    listTransaction();

    setTransactionForm({
      valor: "",
      categoria: "",
      data: "",
      descricao: "",
    });
  }

  useEffect(() => {
    listCategoriApi();
  }, []);

  return (
    <div className="containerModal">
      <div className="transactionModalBox">
        <div className="titleModal">
          <h2>Adicionar Registro</h2>
          <img
            onClick={() => setDisplayTransaction(false)}
            src={iconClose}
            alt="icone de sair"
          />
        </div>
        <div className="modalInputOutput">
          <button
            onClick={() => setToggleInputOutput(true)}
            id={toggleInputOutput ? "btnInput" : "btnDeactivate"}
          >
            Entrada
          </button>

          <button
            onClick={() => setToggleInputOutput(false)}
            id={toggleInputOutput ? "btnDeactivate" : "btnOutput"}
          >
            Saída
          </button>
        </div>
        <div className="formModal">
          <div>
            <span>Valor</span>
            <input
              name="valor"
              value={transactionForm.valor}
              required
              onChange={(e) => fillingTransactionForm(e)}
              type={"number"}
            />
          </div>
          <div>
            <span>Categoria</span>
            <select
              value={transactionForm.categoria}
              required
              onChange={(e) => fillingTransactionForm(e)}
              name="categoria"
              id="categoria"
            >
              <option value={""}></option>
              {categories.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.descricao}
                </option>
              ))}
            </select>
          </div>
          {toggleInputOutput && (
            <div>
              <span>Data</span>
              <PatternFormat
                displayType="input"
                name="data"
                value={transactionForm.data}
                required
                minLength={10}
                onChange={(e) => fillingTransactionForm(e)}
                format="##/##/####"
              />
            </div>
          )}
          <div>
            <span>Descrição</span>
            <input
              name="descricao"
              required
              value={transactionForm.descricao}
              onChange={(e) => fillingTransactionForm(e)}
              type="text"
            />
          </div>
        </div>
        <span>{showMessage}</span>
        <div className="btnConfirm">
          <button
            onClick={() => {
              transactionForm.id
                ? transactionUpdate(transactionForm.id)
                : transact(toggleInputOutput ? "entrada" : "saida");
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
