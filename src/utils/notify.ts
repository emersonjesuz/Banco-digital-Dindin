import { toast } from "react-toastify";

type NotifyTypes = "success" | "warning" | "error" | "default" | "info";

export default function notify(message: string, type: NotifyTypes) {
  toast(message, {
    type: type,
    theme: "colored",
    position: "top-right",
    style: {
      width: "300px",
      height: "70px",
      fontSize: "18px",
    },
    pauseOnHover: false,
  });
}
