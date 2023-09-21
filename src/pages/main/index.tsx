import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/index.ts";
import iconArrowUp from "../../assets/cetaPracima.png";
import iconFilter from "../../assets/icon-filtro.png";
import iconMore from "../../assets/mais.png";
import Header from "../../components/Header/index.tsx";
import ListTransact from "../../components/ListTransact/index.tsx";
import DeleteTransactModal from "../../components/Modals/deleteTransactModal/index.tsx";
import ExtractModal from "../../components/Modals/extractModal/index.tsx";
import TransactionModal from "../../components/Modals/transactionModal/index.tsx";
import UserEditModal from "../../components/Modals/userEditModal/index.tsx";
import SummaryCard from "../../components/SummaryCard/index.tsx";
import NotifyError from "../../utils/NotifyError.tsx";
import { formatDate, getItemLocalStore } from "../../helpers/index.ts";
import { TransactFormTypes } from "../../types/transactFormTypes.ts";
import { TransactTypes } from "../../types/transactTypes.ts";
import notify from "../../utils/notify.ts";
import styles from "./styles.module.scss";

export default function Main() {
  const [displayTransaction, setDisplayTransaction] = useState<boolean>(false);
  const [toggleInputOutput, setToggleInputOutput] = useState<boolean>(false);
  const [showSortingDate, setShowSortingDate] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showExtractCard, setShowExtractCard] = useState<boolean>(false);
  const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);

  const [showTransaction, setshowTransaction] = useState<TransactTypes[]>([]);
  const [getTransactData, setGetTransactData] = useState<TransactTypes>({
    categoria_id: 0,
    categoria_nome: "",
    data: new Date(),
    descricao: "",
    id: 0,
    tipo: "",
    usuario_id: 0,
    valor: 0,
    actionFilter: false,
    popUp: false,
  });
  const [formCategory, setFormCategory] = useState<string[]>([]);
  const [transactionForm, setTransactionForm] = useState<TransactFormTypes>({
    valor: 0,
    categoria: 0,
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

  async function bankStatement() {
    try {
      const statement = await api.get(`/transacao/extrato`);

      if (!statement) {
        return notify("Extrato não encontrado", "info");
      }

      const { entrada, saida } = statement.data;
      setDataBankStatement({
        entrada: +(entrada / 100).toFixed(2),
        saida: +(saida / 100).toFixed(2),
        saldo: +((entrada - saida) / 100).toFixed(2),
      });
    } catch (error) {
      NotifyError(error);
    }
  }

  function colectCategory(category: string) {
    const getClassName = category;

    if (!getClassName) return;
    const checkedForm = formCategory.indexOf(getClassName);

    if (checkedForm !== -1) {
      return;
    }
    setFormCategory([...formCategory, getClassName]);
  }

  async function listTransaction(clear?: string[]) {
    if (formCategory.length) {
      for (let category of formCategory) {
        ClearCategoryFilter += `filtro[]=${category}&&`;
      }
    }

    if (clear) {
      if (clear[0] === "clear") ClearCategoryFilter = "?";
    }

    try {
      const transaction: any = await api.get(
        `/transacao${ClearCategoryFilter}`
      );

      const data: TransactTypes[] = transaction.data;

      data.forEach((data) => {
        data.popUp = false;
        data.actionFilter = false;
      });
      const dados = [...data];

      setshowTransaction(dados);
      bankStatement();
    } catch (error) {
      NotifyError(error);
    }
  }

  async function transactionDelete(id: number) {
    if (!id) return;
    try {
      await api.delete(`/transacao/${id}`);
      listTransaction();
      notify("transação excluida !", "success");
    } catch (error) {
      NotifyError(error);
    }
  }

  function showPopUp(id: number, disconnector: boolean) {
    const collectTransaction = showTransaction.find(
      (transaction) => transaction.id === id
    );

    if (!collectTransaction) return;

    collectTransaction.popUp = disconnector;

    setshowTransaction([...showTransaction]);
  }

  function transactionEdit(id: number) {
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

  function sortDate(sorting: boolean) {
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
  function handleAddRegistry() {
    setDisplayTransaction(true);
    setToggleInputOutput(false);
    setTransactionForm({
      valor: 0,
      categoria: 0,
      data: "",
      descricao: "",
    });
  }
  useEffect(() => {
    if (!getItemLocalStore("token")) {
      navegate("/");
    }
  });

  useEffect(() => {
    listTransaction();
  }, []);

  return (
    <div className={styles.containerHome}>
      <Header
        listTransaction={listTransaction}
        setShowUserModal={setShowUserModal}
      />

      <main>
        <div className={styles.mainContainer}>
          <div className={styles.mainListFilter}>
            <div className={styles.contentButton}>
              <button
                className={styles.buttonAddRegistry}
                onClick={handleAddRegistry}
              >
                Adicionar Registro
              </button>
              <div
                className={styles.mainFilter}
                onClick={() => {
                  setShowFilter(!showFilter);
                }}
              >
                <img src={iconFilter} alt=" icone de filtro" />
                <span>Filtrar</span>
              </div>
            </div>
            <div className={styles.isActiveSummaryCard}>
              <SummaryCard
                dataBankStatement={dataBankStatement}
                setDisplayTransaction={setDisplayTransaction}
                setToggleInputOutput={setToggleInputOutput}
                setTransactionForm={setTransactionForm}
                showButton={false}
              />
            </div>
          </div>

          <div className={styles.mainContainerlist}>
            <div className={styles.mainBoxList}>
              {showFilter && (
                <div className={styles.boxFilter}>
                  <div className={styles.titleFilter}>
                    <h2>Categorias</h2>
                  </div>
                  <div className={styles.categoryFilterList}>
                    {showTransaction.map((transaction) => (
                      <span
                        className={transaction.categoria_nome}
                        id={
                          transaction.actionFilter
                            ? "filterSelect"
                            : `${transaction.categoria_nome}`
                        }
                        onClick={() => {
                          colectCategory(transaction.categoria_nome);
                          transaction.actionFilter = true;
                        }}
                        key={transaction.id}
                      >
                        {transaction.categoria_nome}
                        <img src={iconMore} alt="" />
                      </span>
                    ))}
                  </div>
                  <div className={styles.btnFilterAction}>
                    <button
                      onClick={() => {
                        setFormCategory([]);
                        showTransaction.forEach(
                          (transaction) => (transaction.actionFilter = false)
                        );
                        listTransaction(["clear"]);
                      }}
                    >
                      Limpar Filtros
                    </button>
                    <button
                      onClick={() => listTransaction()}
                      id={styles.btnApplyFilter}
                    >
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              )}
              <div className={styles.mainListTask}>
                <div className={styles.mainListTaskHeader}>
                  <div
                    id={styles.boxDate}
                    onClick={() => {
                      sortDate(showSortingDate);
                      setShowSortingDate(!showSortingDate);
                    }}
                  >
                    <span id={styles.date}>Data</span>
                    <img
                      id={
                        showSortingDate
                          ? styles.iconArrowRotate
                          : styles.iconArrow
                      }
                      src={iconArrowUp}
                      alt="ceta pra cima "
                    />
                  </div>
                  <div id={styles.dayWeek}>
                    <span>Dia da semana</span>
                  </div>
                  <div id={styles.description}>
                    <span>Descrição</span>
                  </div>
                  <div id={styles.category}>
                    <span>Categoria</span>
                  </div>
                  <div id={styles.value}>
                    <span> Valor</span>
                  </div>
                  <div id={styles.Registros}>
                    <span>Registros</span>
                  </div>
                </div>
                <div className={styles.listTask}>
                  {showTransaction.map((transaction) => (
                    <ListTransact
                      key={transaction.id}
                      transaction={transaction}
                      showPopUp={showPopUp}
                      transactionEdit={transactionEdit}
                      setGetTransactData={setGetTransactData}
                      setShowExtractCard={setShowExtractCard}
                      setShowDeleteCard={setShowDeleteCard}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.isActiveSummary}>
              <SummaryCard
                dataBankStatement={dataBankStatement}
                setDisplayTransaction={setDisplayTransaction}
                setToggleInputOutput={setToggleInputOutput}
                setTransactionForm={setTransactionForm}
                showButton={true}
              />
            </div>
          </div>
        </div>
      </main>
      {displayTransaction && (
        <TransactionModal
          setDisplayTransaction={setDisplayTransaction}
          toggleInputOutput={toggleInputOutput}
          setToggleInputOutput={setToggleInputOutput}
          setTransactionForm={setTransactionForm}
          listTransaction={listTransaction}
          transactionForm={transactionForm}
        />
      )}
      {showUserModal && (
        <UserEditModal
          setShowUserModal={setShowUserModal}
          showUserModal={showUserModal}
        />
      )}
      {showExtractCard && (
        <ExtractModal
          transact={getTransactData}
          setShowExtractCard={setShowExtractCard}
          transactionEdit={transactionEdit}
          setShowDeleteCard={setShowDeleteCard}
        />
      )}

      {showDeleteCard && (
        <DeleteTransactModal
          showPopUp={showPopUp}
          transaction={getTransactData}
          transactionDelete={transactionDelete}
          setShowDeleteCard={setShowDeleteCard}
        />
      )}
    </div>
  );
}
