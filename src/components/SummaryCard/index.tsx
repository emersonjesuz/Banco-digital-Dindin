import { formatValue } from "../../helpers/formmatValue.ts";
import { TransactFormTypes } from "../../types/transactFormTypes.ts";
import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";

type DataBankStatementTypes = {
  entrada: number;
  saida: number;
  saldo: number;
};

type Props = {
  setDisplayTransaction: Dispatch<SetStateAction<boolean>>;
  setToggleInputOutput: Dispatch<SetStateAction<boolean>>;
  setTransactionForm: Dispatch<SetStateAction<TransactFormTypes>>;
  dataBankStatement: DataBankStatementTypes;
  showButton: boolean;
};

export default function SummaryCard({
  setDisplayTransaction,
  setToggleInputOutput,
  setTransactionForm,
  dataBankStatement,
  showButton,
}: Props) {
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
  return (
    <div className={styles.mainSummaryBox}>
      <div className={styles.summaryBoxData}>
        <div className={styles.summaryTitle}>
          <h2>Resumo</h2>
        </div>
        <div className={styles.summaryInputOutput}>
          <div>
            <span>Entradas</span>
            <span id={styles.inputs}>
              {formatValue(dataBankStatement.entrada)}
            </span>
          </div>
          <div>
            <span>Saidas</span>
            <span id={styles.outputs}>
              {formatValue(dataBankStatement.saida)}
            </span>
          </div>
        </div>
        <div className={styles.balanceSummary}>
          <span>Saldo </span>
          <span id={styles.balance}>
            {formatValue(dataBankStatement.saldo)}
          </span>
        </div>
      </div>
      {showButton && (
        <button onClick={handleAddRegistry}>Adicionar Registro</button>
      )}
    </div>
  );
}
