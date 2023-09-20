export type TransactTypes = {
  id: number;
  tipo: string;
  descricao: string;
  valor: number;
  data: Date;
  usuario_id: number;
  categoria_id: number;
  categoria_nome: string;
  popUp?: boolean;
  actionFilter?: boolean;
};
