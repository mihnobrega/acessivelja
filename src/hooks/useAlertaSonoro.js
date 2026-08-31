import {
  useEffect
} from "react";

import {
  falarMensagem
} from "../utils/acessibilidade";


function useAlertaSonoro(mensagem) {
  useEffect(() => {
    if (!mensagem) {
      return;
    }

    falarMensagem(
      mensagem
    );
  }, []);
}

export default useAlertaSonoro;