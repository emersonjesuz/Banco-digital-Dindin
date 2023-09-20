import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { PatternFormat } from "react-number-format";
import api from "../../../api/index.ts";
import iconClose from "../../../assets/+.png";
import { TransactFormTypes } from "../../../types/transactFormTypes.ts";
import styles from "./styles.module.scss";
import NotifyError from "../../../utils/NotifyError.tsx";
import notify from "../../../utils/notify.ts";

type Props = {
  setDisplayTransaction: Dispatch<SetStateAction<boolean>>;
  setToggleInputOutput: Dispatch<SetStateAction<boolean>>;
  setTransactionForm: Dispatch<SetStateAction<TransactFormTypes>>;
  listTransaction: () => void;
  toggleInputOutput: boolean;
  transactionForm: TransactFormTypes;
};

type CategoryType = {
  id: number;
  descricao: string;
};

export default function TransactionModal({
  setDisplayTransaction,
  toggleInputOutput,
  setToggleInputOutput,
  transactionForm,
  setTransactionForm,
  listTransaction,
}: Props) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showMessage, setShowMessage] = useState("");

  async function listCategoriApi() {
    const categoryData: any = await api
      .get(`/categoria`)
      .catch(() => setShowMessage("nenhuma categoria encontrada"));

    if (!categoryData.data) {
      return notify("nenhuma categoria encontrada", "info");
    }

    setCategories(categoryData.data);
  }

  function handlerTransactionForm(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) {
    setTransactionForm({
      ...transactionForm,
      [event.target.name]: event.target.value,
    });
  }

  async function transact(type: "entrada" | "saida") {
    const { data, valor, categoria, descricao } = transactionForm;

    if (!valor || !categoria || !descricao) {
      notify("Preecha todos os campos !", "info");
      return;
    }
    if (valor > 1000000) {
      notify("valor limite exedido !", "info");
      return;
    }

    const transaction = {
      tipo: type,
      descricao,
      valor: +valor,
      data: data ? data : new Date(),
      categoria_id: categoria,
    };

    try {
      await api.post("/transacao", { ...transaction });

      listTransaction();

      notify("Transação efetuada com sucesso !", "success");

      setTimeout(() => {
        setDisplayTransaction(false);
      }, 2000);
      setTransactionForm({
        valor: 0,
        categoria: 0,
        data: "",
        descricao: "",
      });
    } catch (error) {
      NotifyError(error);
    }
  }

  async function transactionUpdate(id: number) {
    const { descricao, valor, data, categoria, tipo } = transactionForm;

    const checkingForm =
      !descricao || !valor || !data || !categoria || !tipo || !id;

    if (checkingForm) {
      notify("Preecha todos os campos !", "info");
      return;
    }

    if (valor > 1000000) {
      notify("valor limite exedido !", "info");
      return;
    }

    const dateInvert = new Date(data.split("/").reverse().join("/"));

    const newTransactionUpdate = {
      descricao,
      valor,
      data: dateInvert,
      categoria_id: categoria,
      tipo,
    };

    try {
      await api.put(`/transacao/${id}`, {
        ...newTransactionUpdate,
      });

      listTransaction();

      notify("Transação atualizada com sucesso !", "success");

      setTimeout(() => {
        setDisplayTransaction(false);
      }, 2000);
      setTransactionForm({
        valor: 0,
        categoria: 0,
        data: "",
        descricao: "",
      });
    } catch (error) {
      NotifyError(error);
    }
  }

  useEffect(() => {
    listCategoriApi();
  }, []);

  return (
    <div className={styles.containerModal}>
      <div className={styles.transactionModalBox}>
        <div className={styles.titleModal}>
          <h2>Adicionar Registro</h2>
          <img
            onClick={() => {
              setDisplayTransaction(false);
            }}
            src={iconClose}
            alt="icone de sair"
          />
        </div>
        <div className={styles.modalInputOutput}>
          <button
            onClick={() => setToggleInputOutput(true)}
            id={toggleInputOutput ? styles.btnInput : styles.btnDeactivate}
          >
            Entrada
          </button>

          <button
            onClick={() => setToggleInputOutput(false)}
            id={toggleInputOutput ? styles.btnDeactivate : styles.btnOutput}
          >
            Saída
          </button>
        </div>
        <div className={styles.formModal}>
          <div>
            <span>Valor</span>
            <input
              name="valor"
              value={transactionForm.valor}
              required
              onChange={handlerTransactionForm}
              type={"number"}
              maxLength={7}
              max={7}
            />
          </div>
          <div>
            <span>Categoria</span>
            <select
              value={transactionForm.categoria}
              required
              onChange={handlerTransactionForm}
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
                onChange={handlerTransactionForm}
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
              onChange={(e) => handlerTransactionForm(e)}
              type="text"
            />
          </div>
        </div>
        <span>{showMessage}</span>
        <div className={styles.btnConfirm}>
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
