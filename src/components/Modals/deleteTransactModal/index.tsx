import { TransactTypes } from "../../../types/transactTypes.ts";
import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";

type Props = {
  transaction: TransactTypes;
  transactionDelete: (id: number) => void;
  showPopUp: (id: number, disconnector: boolean) => void;
  setShowDeleteCard: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteTransactModal({
  transaction,
  showPopUp,
  transactionDelete,
  setShowDeleteCard,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.showBoxPopup}>
        <div>
          <span>Apagar item?</span>
        </div>

        <div className={styles.showBtnPopup}>
          <button
            onClick={() => {
              setShowDeleteCard(false);
              transactionDelete(transaction.id);
            }}
            id={styles.btnYes}
          >
            Sim
          </button>
          <button
            onClick={() => {
              showPopUp(transaction.id, false);
              setShowDeleteCard(false);
            }}
            id={styles.btnNo}
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
}
