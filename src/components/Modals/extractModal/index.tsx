import { formatValue } from "../../../helpers/formmatValue.ts";
import { dayWeek, formatDate } from "../../../helpers/index.ts";
import { TransactTypes } from "../../../types/transactTypes.ts";
import styles from "./styles.module.scss";
import iconDelete from "../../../assets/icon-lixo.png";
import iconEdit from "../../../assets/icon-editar.png";
import iconClose from "../../../assets/+.png";
import { Dispatch, SetStateAction } from "react";

type Props = {
  transact: TransactTypes;
  setShowExtractCard: Dispatch<SetStateAction<boolean>>;
  transactionEdit: (id: number) => void;
  setShowDeleteCard: Dispatch<SetStateAction<boolean>>;
};

export default function ExtractModal({
  transact,
  setShowExtractCard,
  transactionEdit,
  setShowDeleteCard,
}: Props) {
  return (
    <div className={styles.conteinerModal}>
      <div className={styles.contentModal}>
        <img
          onClick={() => setShowExtractCard(false)}
          id={styles.iconClose}
          src={iconClose}
          alt=""
        />
        <div className={styles.contentInfo}>
          <div className={styles.boxCategoryAndData}>
            <div>
              <strong>Categoria</strong>
              <span>{transact.categoria_nome}</span>
            </div>
            <div>
              <strong>Data</strong>
              <span>{formatDate(transact.data, "dd/MM/yy")}</span>
            </div>
          </div>
          <div className={styles.boxCategoryAndData}>
            <div>
              <strong>Dia da semana</strong>
              <span>{dayWeek(transact.data)}</span>
            </div>
            <div>
              <strong>Valor</strong>
              <span
                style={{
                  color: transact.tipo === "saida" ? "#fa8c10" : "#7978d9",
                }}
              >
                {formatValue(transact.valor)}
              </span>
            </div>
          </div>
          <div className={styles.boxDescription}>
            <strong>Descrição</strong>

            <textarea value={transact.descricao} disabled></textarea>
          </div>
        </div>
        <div className={styles.contentButton}>
          <button onClick={() => transactionEdit(transact.id)}>
            Editar <img src={iconEdit} alt="icone de editar" />
          </button>
          <button
            onClick={() => {
              setShowDeleteCard(true);
            }}
          >
            Excluir <img src={iconDelete} alt="icone de excluir" />
          </button>
        </div>
      </div>
    </div>
  );
}
