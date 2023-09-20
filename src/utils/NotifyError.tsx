import axios from "axios";
import notify from "./notify.ts";
import { clearItemLocalstore } from "../helpers/index.ts";

export default function NotifyError(error: any) {
  if (axios.isAxiosError(error)) {
    const ErrorMessage: string = error.response?.data.mensagem;
    if (error.response?.status === 500) {
      const verifyError = ErrorMessage.split(" ");

      if (verifyError[2] === "date/time") {
        notify("Data informada é invalida !", "error");
        return;
      }
      if (verifyError[3] === "token") {
        notify("sessão expirou!", "error");
        clearItemLocalstore();
        return;
      }

      notify("Erro interno!", "error");
      return;
    }
    return notify(ErrorMessage, "error");
  }

  return notify("oops, estamos com problemas internos!", "error");
}
