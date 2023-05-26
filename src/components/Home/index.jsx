import "./style.css";

import iconFilter from "../../assets/icon-filtro.png";
import iconEdit from "../../assets/icon-editar.png";
import iconTrash from "../../assets/icon-lixo.png";
import iconTriangle from "../../assets/triangulo.png";
import iconArrowUp from "../../assets/cetaPracima.png";
import iconMore from "../../assets/mais.png";
import { useEffect, useRef, useState } from "react";
import { clearItem, dayWeek, formatDate, getItem } from "../../utils";
import { useNavigate } from "react-router-dom";
import TransactionModal from "../Modals/transactionModal";
import UserEditModal from "../Modals/userEditModal";
import api from "../../api";
import Header from "../Header";

export default function Home() {
  const [displayTransaction, setDisplayTransaction] = useState(false);
  const [toggleInputOutput, setToggleInputOutput] = useState(false);
  const [showSortingDate, setShowSortingDate] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [showTransaction, setshowTransaction] = useState([]);
  const [formCategory, setFormCategory] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
    valor: "",
    categoria: "",
    data: "",
    descricao: "",
  });
  const [dataBankStatement, setDataBankStatement] = useState({
    entrada: 0,
    saida: 0,
    saldo: 0,
  });
  let ClearCategoryFilter = useRef("?").current;
  const navegate = useNavigate();
  const token = getItem("token");

  async function bankStatement() {
    const statement = await api
      .get(`/transacao/extrato`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => {
        timeMessage("Extrato não encontrado");
        setTimeout(() => {
          clearItem();
        }, 1000);
      });

    if (!statement) {
      return timeMessage("Extrato não encontrado");
    }

    const { entrada, saida } = statement.data;
    setDataBankStatement({
      entrada: (entrada / 100).toFixed(2),
      saida: (saida / 100).toFixed(2),
      saldo: ((entrada - saida) / 100).toFixed(2),
    });
  }

  function colectCategory(e) {
    const checkedForm = formCategory.indexOf(e.target.className);

    if (checkedForm !== -1) {
      return;
    }
    setFormCategory([...formCategory, e.target.className]);
  }

  async function listTransaction(...clear) {
    if (formCategory.length) {
      for (let category of formCategory) {
        ClearCategoryFilter += `filtro[]=${category}&&`;
      }
    }

    if (clear[0] === "clear") ClearCategoryFilter = "?";

    const transaction = await api
      .get(`/transacao${ClearCategoryFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => {
        timeMessage("Nenhuma transação encontrada");
      });

    transaction.data.map((data) => {
      data.popUp = false;
      data.actionFilter = false;
    });
    const dados = [...transaction.data];

    setshowTransaction(dados);
    bankStatement();
  }

  async function transactionDelete(id) {
    if (!id) return;

    await api
      .delete(`/transacao/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => timeMessage("Transação não encontrada"));

    listTransaction();
  }

  function showPopUp(id, disconnector) {
    const collectTransaction = showTransaction.find(
      (transaction) => transaction.id === id
    );

    if (!collectTransaction) return;

    collectTransaction.popUp = disconnector;

    setshowTransaction([...showTransaction]);
  }

  function formatValue(value) {
    const convertedValue = String(parseFloat(value / 100).toFixed(2)).replace(
      ".",
      ","
    );

    return convertedValue;
  }

  function transactionEdit(id) {
    const collectTransaction = showTransaction.find(
      (transaction) => transaction.id === id
    );

    if (!collectTransaction) return;

    const { data, valor, categoria_id } = collectTransaction;
    setTransactionForm({
      ...collectTransaction,
      data: formatDate(data, "dd/MM/yyyy"),
      valor,
      categoria: categoria_id,
    });

    setDisplayTransaction(true);
    setToggleInputOutput(true);
  }

  function sortDate(sorting) {
    const sortingDate = showTransaction.sort((a, b) => {
      if (sorting) {
        if (a.data < b.data) return 1;
        if (a.data > b.data) return -1;
        return 0;
      }
      if (b.data < a.data) return 1;
      if (b.data > a.data) return -1;
      return 0;
    });
    setshowTransaction(sortingDate);
  }

  function timeMessage(text) {
    setShowMessage(text);
    setTimeout(() => {
      setShowMessage("");
    }, 2000);
  }

  useEffect(() => {
    if (!getItem("token")) {
      navegate("/login");
    }
  });

  useEffect(() => {
    listTransaction();
  }, []);

  return (
    <div className="containerHome">
      {showMessage && (
        <div className="showMessageErro">
          <strong>{showMessage}</strong>
        </div>
      )}
      <Header
        listTransaction={listTransaction}
        setShowUserModal={setShowUserModal}
      />

      <main>
        <div className="mainContainer">
          <div className="mainListFilter">
            <div
              onClick={() => {
                setShowFilter(!showFilter);
              }}
            >
              <img src={iconFilter} alt=" icone de filtro" />
              <span>Filtrar</span>
            </div>
          </div>

          <div className="mainContainerlist">
            <div className="mainBoxList ">
              {showFilter && (
                <div className="boxFilter">
                  <div className="titleFilter">
                    <h2>Categorias</h2>
                  </div>
                  <div className="categoryFilterList">
                    {showTransaction.map((transaction) => (
                      <span
                        className={transaction.categoria_nome}
                        id={
                          transaction.actionFilter
                            ? "filterSelect"
                            : `${transaction.categoria_nome}`
                        }
                        onClick={(e) => {
                          transaction.actionFilter = true;

                          colectCategory(e);
                        }}
                        key={transaction.id}
                      >
                        {transaction.categoria_nome}
                        <img src={iconMore} alt="" />
                      </span>
                    ))}
                  </div>
                  <div className="btnFilterAction">
                    <button
                      onClick={() => {
                        setFormCategory([]);
                        showTransaction.forEach(
                          (transaction) => (transaction.actionFilter = false)
                        );
                        listTransaction("clear");
                      }}
                    >
                      Limpar Filtros
                    </button>
                    <button
                      onClick={() => listTransaction()}
                      id="btnApplyFilter"
                    >
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              )}
              <div className="mainListTask">
                <div className="mainListTaskHeader">
                  <div
                    id={"boxDate"}
                    onClick={() => {
                      sortDate(showSortingDate);
                      setShowSortingDate(!showSortingDate);
                    }}
                  >
                    <span id="date">Data</span>
                    <img
                      id={showSortingDate ? "iconArrowRotate" : "iconArrow"}
                      src={iconArrowUp}
                      alt="ceta pra cima "
                    />
                  </div>

                  <div>
                    <span id="dayWeek">Dia da semana</span>
                  </div>
                  <div>
                    <span>Descrição</span>
                  </div>
                  <div>
                    <span>Categoria</span>
                  </div>
                  <div>
                    <span id="value"> Valor</span>
                  </div>
                </div>
                <div className="listTask">
                  {showTransaction.map((transaction) => (
                    <div className="itemListTask" key={transaction.id}>
                      <div className="listTaskContent">
                        <span id="listTaskContentDate">
                          {formatDate(transaction.data, "dd/MM/yy")}
                        </span>
                      </div>
                      <div className="listTaskContent">
                        <span>{dayWeek(transaction.data)}</span>
                      </div>
                      <div className="listTaskContent">
                        <span>{transaction.descricao}</span>
                      </div>
                      <div className="listTaskContent">
                        <span>{transaction.categoria_nome}</span>
                      </div>
                      <div className="listTaskContent">
                        <span
                          id={
                            transaction.tipo === "saida"
                              ? "outputValue"
                              : "inputValue"
                          }
                        >
                          R$ {formatValue(transaction.valor)}
                        </span>
                      </div>
                      <div className="listTaskContent">
                        <img
                          onClick={() => {
                            transactionEdit(transaction.id);
                          }}
                          src={iconEdit}
                          alt=" icone de editar"
                        />
                        <img
                          onClick={() => showPopUp(transaction.id, true)}
                          src={iconTrash}
                          alt="icone da lixeira"
                        />
                      </div>

                      {transaction.popUp && (
                        <>
                          <img
                            id="triangle"
                            src={iconTriangle}
                            alt="triangulo do popUp"
                          />
                          <div className="showBoxPopup">
                            <div>
                              <span>Apagar item?</span>
                            </div>

                            <div className="showBtnPopup">
                              <button
                                onClick={() =>
                                  transactionDelete(transaction.id)
                                }
                                id="btnYes"
                              >
                                Sim
                              </button>
                              <button
                                onClick={(e) =>
                                  showPopUp(transaction.id, false)
                                }
                                id="btnNo"
                              >
                                Não
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mainSummaryBox">
              <div className="summaryBoxData">
                <div className="summaryTitle">
                  <h2>Resumo</h2>
                </div>
                <div className="summaryInputOutput">
                  <div>
                    <span>Entradas</span>
                    <span id="inputs">R$ {dataBankStatement.entrada}</span>
                  </div>
                  <div>
                    <span>Saidas</span>
                    <span id="outputs">R$ {dataBankStatement.saida}</span>
                  </div>
                </div>
                <div className="balanceSummary">
                  <span>Saldo</span>
                  <span id="balance">R$ {dataBankStatement.saldo}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setDisplayTransaction(true);
                  setToggleInputOutput(false);
                  setTransactionForm({
                    valor: "",
                    categoria: "",
                    data: "",
                    descricao: "",
                  });
                }}
              >
                Adicionar Registro
              </button>
            </div>
          </div>
        </div>
      </main>
      {displayTransaction && (
        <TransactionModal
          setDisplayTransaction={setDisplayTransaction}
          toggleInputOutput={toggleInputOutput}
          setToggleInputOutput={setToggleInputOutput}
          transactionForm={transactionForm}
          setTransactionForm={setTransactionForm}
          listTransaction={listTransaction}
          timeMessage={timeMessage}
        />
      )}
      {showUserModal && (
        <UserEditModal
          setShowUserModal={setShowUserModal}
          showUserModal={showUserModal}
          timeMessage={timeMessage}
        />
      )}
    </div>
  );
}
