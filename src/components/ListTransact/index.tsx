import { Dispatch, SetStateAction, useEffect } from "react";
import iconEdit from "../../assets/icon-editar.png";
import iconTrash from "../../assets/icon-lixo.png";
import { formatValue } from "../../helpers/formmatValue.ts";
import { dayWeek, formatDate } from "../../helpers/index.ts";
import { TransactTypes } from "../../types/transactTypes.ts";
import styles from "./styles.module.scss";

type Props = {
  transaction: TransactTypes;
  showPopUp: (id: number, disconnector: boolean) => void;
  transactionEdit: (id: number) => void;
  setGetTransactData: Dispatch<SetStateAction<TransactTypes>>;
  setShowExtractCard: Dispatch<SetStateAction<boolean>>;
  setShowDeleteCard: Dispatch<SetStateAction<boolean>>;
};

export default function ListTransact({
  transaction,
  showPopUp,
  transactionEdit,
  setGetTransactData,
  setShowExtractCard,
  setShowDeleteCard,
}: Props) {
  const handleEvent = document.querySelectorAll(".handleEvent");

  useEffect(() => {
    const array: any[] = [...handleEvent];

    array.forEach((event: any) => {
      event.addEventListener("click", () => {
        setShowExtractCard(true);
      });
    });
  });

  return (
    <div
      onClick={() => {
        setGetTransactData(transaction);
      }}
      className={styles.itemListTask}
      key={transaction.id}
    >
      <div
        id={styles.boxDate}
        className={styles.listTaskContent + "  handleEvent"}
      >
        <span id={styles.listTaskContentDate}>
          {formatDate(transaction.data, "dd/MM/yy")}
        </span>
      </div>
      <div
        id={styles.dayWeek}
        className={styles.listTaskContent + "  handleEvent"}
      >
        <span>{dayWeek(transaction.data)}</span>
      </div>
      <div
        id={styles.description}
        className={styles.listTaskContent + "  handleEvent"}
      >
        <span>{transaction.descricao}</span>
      </div>
      <div className={styles.listTaskContent + "  handleEvent"}>
        <span>{transaction.categoria_nome}</span>
      </div>
      <div className={styles.listTaskContent + "  handleEvent"}>
        <span
          id={
            transaction.tipo === "saida"
              ? styles.outputValue
              : styles.inputValue
          }
        >
          {formatValue(transaction.valor)}
        </span>
      </div>
      <div id={styles.contentIcone} className={styles.listTaskContent}>
        <img
          onClick={() => {
            transactionEdit(transaction.id);
          }}
          src={iconEdit}
          alt=" icone de editar"
        />
        <img
          onClick={() => {
            showPopUp(transaction.id, true);
            setShowDeleteCard(true);
          }}
          src={iconTrash}
          alt="icone da lixeira"
        />
      </div>
    </div>
  );
}
