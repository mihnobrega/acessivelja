import {
  useState
} from "react";

function DriverRegisterModal({
  aberto,
  onClose,
  onFinalizar
}) {
  const [
    etapa,
    setEtapa
  ] = useState(1);

  const [
    dados,
    setDados
  ] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    cnh: "",
    modeloVeiculo: "",
    placa: "",
    corVeiculo: "",
    adaptacoes: [],
    documentoCNH: "",
    documentoVeiculo: ""
  });

  function atualizarCampo(
    campo,
    valor
  ) {
    setDados({
      ...dados,
      [campo]: valor
    });
  }

  function alternarAdaptacao(
    adaptacao
  ) {
    const existe =
      dados.adaptacoes.includes(
        adaptacao
      );

    if (existe) {
      atualizarCampo(
        "adaptacoes",
        dados.adaptacoes.filter(
          (item) =>
            item !== adaptacao
        )
      );

      return;
    }

    atualizarCampo(
      "adaptacoes",
      [
        ...dados.adaptacoes,
        adaptacao
      ]
    );
  }

  function avancar() {

  // ========================================
  // VALIDAR ETAPA 1
  // ========================================

  if (
    etapa === 1 &&
    (
      !dados.nome.trim() ||
      !dados.cpf.trim() ||
      !dados.telefone.trim() ||
      !dados.cnh.trim()
    )
  ) {
    alert(
      "Preencha todos os dados pessoais para continuar."
    );

    return;
  }


  // ========================================
  // VALIDAR ETAPA 2
  // ========================================

  if (
    etapa === 2 &&
    (
      !dados.modeloVeiculo.trim() ||
      !dados.placa.trim() ||
      !dados.corVeiculo.trim()
    )
  ) {
    alert(
      "Preencha todos os dados do veículo para continuar."
    );

    return;
  }


  // ========================================
  // VALIDAR ETAPA 3
  // ========================================

  if (
    etapa === 3 &&
    dados.adaptacoes.length === 0
  ) {
    alert(
      "Selecione pelo menos um recurso de acessibilidade."
    );

    return;
  }


  // ========================================
  // AVANÇAR
  // ========================================

  if (
    etapa < 4
  ) {
    setEtapa(
      etapa + 1
    );
  }
}

  function voltar() {
    if (
      etapa > 1
    ) {
      setEtapa(
        etapa - 1
      );

      return;
    }

    onClose();
  }

  function finalizarCadastro() {

  if (
    !dados.documentoCNH ||
    !dados.documentoVeiculo
  ) {
    alert(
      "Adicione todos os documentos obrigatórios."
    );

    return;
  }

  onFinalizar(
    dados
  );
}

  if (!aberto) {
    return null;
  }

  return (
    <div className="driver-modal-overlay">

      <div className="driver-modal">

        <div className="driver-modal-shine driver-modal-shine-one"></div>
        <div className="driver-modal-shine driver-modal-shine-two"></div>


        <div className="driver-modal-header">

          <div>

            <span className="driver-modal-label">
              PERFIL DE MOTORISTA
            </span>

            <h2>
              Cadastre-se para dirigir
            </h2>

            <p>
              Complete as etapas para criar
              seu perfil de motorista.
            </p>

          </div>

          <button
            type="button"
            className="driver-modal-close"
            onClick={
              onClose
            }
            aria-label="Fechar cadastro"
          >
            ×
          </button>

        </div>


        <div className="driver-steps">

          {[1, 2, 3, 4].map(
            (numero) => (
              <div
                key={numero}
                className={
                  etapa === numero
                    ? "driver-step active"
                    : etapa > numero
                      ? "driver-step completed"
                      : "driver-step"
                }
              >
                <span>
                  {etapa > numero
                    ? "✓"
                    : numero}
                </span>
              </div>
            )
          )}

        </div>


        <div className="driver-modal-content">


          {/* ETAPA 1 */}

          {etapa === 1 && (
            <div className="driver-form-section">

              <div className="driver-section-title">

                <span>
                  01
                </span>

                <div>

                  <h3>
                    Dados pessoais
                  </h3>

                  <p>
                    Informe seus dados principais.
                  </p>

                </div>

              </div>

              <label className="driver-field">

                <span>
                  Nome completo
                </span>

                <input
                  type="text"
                  required
                  value={
                    dados.nome
                  }
                  onChange={(evento) =>
                    atualizarCampo(
                      "nome",
                      evento.target.value
                    )
                  }
                  placeholder="Digite seu nome completo"
                />

              </label>

              <div className="driver-grid">

                <label className="driver-field">

                  <span>
                    CPF
                  </span>

                  <input
                    type="text"
                    required
                    value={
                      dados.cpf
                    }
                    onChange={(evento) =>
                      atualizarCampo(
                        "cpf",
                        evento.target.value
                      )
                    }
                    placeholder="000.000.000-00"
                  />

                </label>

                <label className="driver-field">

                  <span>
                    Telefone
                  </span>

                  <input
                    type="tel"
                    required
                    value={
                      dados.telefone
                    }
                    onChange={(evento) =>
                      atualizarCampo(
                        "telefone",
                        evento.target.value
                      )
                    }
                    placeholder="(00) 00000-0000"
                  />

                </label>

              </div>

              <label className="driver-field">

                <span>
                  Número da CNH
                </span>

                <input
                  type="text"
                  required
                  value={
                    dados.cnh
                  }
                  onChange={(evento) =>
                    atualizarCampo(
                      "cnh",
                      evento.target.value
                    )
                  }
                  placeholder="Informe sua CNH"
                />

              </label>

            </div>
          )}


          {/* ETAPA 2 */}

          {etapa === 2 && (
            <div className="driver-form-section">

              <div className="driver-section-title">

                <span>
                  02
                </span>

                <div>

                  <h3>
                    Seu veículo
                  </h3>

                  <p>
                    Cadastre o veículo que será utilizado.
                  </p>

                </div>

              </div>

              <label className="driver-field">

                <span>
                  Modelo do veículo
                </span>

                <input
                  type="text"
                  required
                  value={
                    dados.modeloVeiculo
                  }
                  onChange={(evento) =>
                    atualizarCampo(
                      "modeloVeiculo",
                      evento.target.value
                    )
                  }
                  placeholder="Ex: Chevrolet Spin"
                />

              </label>

              <div className="driver-grid">

                <label className="driver-field">

                  <span>
                    Placa
                  </span>

                  <input
                    type="text"
                    required
                    value={
                      dados.placa
                    }
                    onChange={(evento) =>
                      atualizarCampo(
                        "placa",
                        evento.target.value
                      )
                    }
                    placeholder="ABC1D23"
                  />

                </label>

                <label className="driver-field">

                  <span>
                    Cor
                  </span>

                  <input
                    type="text"
                    required
                    value={
                      dados.corVeiculo
                    }
                    onChange={(evento) =>
                      atualizarCampo(
                        "corVeiculo",
                        evento.target.value
                      )
                    }
                    placeholder="Ex: Prata"
                  />

                </label>

              </div>

            </div>
          )}


          {/* ETAPA 3 */}

          {etapa === 3 && (
            <div className="driver-form-section">

              <div className="driver-section-title">

                <span>
                  03
                </span>

                <div>

                  <h3>
                    Acessibilidade
                  </h3>

                  <p>
                    Selecione os recursos disponíveis.
                  </p>

                </div>

              </div>

              <div className="driver-adaptations">

                {[
                  "Rampa de acesso",
                  "Espaço para cadeira de rodas",
                  "Banco giratório",
                  "Apoio para embarque",
                  "Cinto adaptado",
                  "Veículo rebaixado"
                ].map(
                  (adaptacao) => (
                    <button
                      key={adaptacao}
                      type="button"
                      className={
                        dados.adaptacoes.includes(
                          adaptacao
                        )
                          ? "driver-adaptation selected"
                          : "driver-adaptation"
                      }
                      onClick={() =>
                        alternarAdaptacao(
                          adaptacao
                        )
                      }
                    >
                      <span className="driver-adaptation-check">
                        {dados.adaptacoes.includes(
                          adaptacao
                        )
                          ? "✓"
                          : "+"}
                      </span>

                      {adaptacao}
                    </button>
                  )
                )}

              </div>

            </div>
          )}


          {/* ETAPA 4 */}

          {etapa === 4 && (
            <div className="driver-form-section">

              <div className="driver-section-title">

                <span>
                  04
                </span>

                <div>

                  <h3>
                    Documentos
                  </h3>

                  <p>
                    Para o protótipo, os documentos
                    serão apenas simulados.
                  </p>

                </div>

              </div>

              <label className="driver-upload">

                <span className="driver-upload-icon">
                  ▣
                </span>

                <div>

                  <strong>
                    CNH
                  </strong>

                  <p>
                    Adicione uma imagem da sua CNH.
                  </p>

                </div>

                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(evento) =>
                    atualizarCampo(
                      "documentoCNH",
                      evento.target.files?.[0]?.name || ""
                    )
                  }
                />

              </label>

              {dados.documentoCNH && (
                <p className="driver-file-name">
                  ✓ {dados.documentoCNH}
                </p>
              )}

              <label className="driver-upload">

                <span className="driver-upload-icon">
                  ◫
                </span>

                <div>

                  <strong>
                    Documento do veículo
                  </strong>

                  <p>
                    Adicione uma imagem do documento.
                  </p>

                </div>

                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(evento) =>
                    atualizarCampo(
                      "documentoVeiculo",
                      evento.target.files?.[0]?.name || ""
                    )
                  }
                />

              </label>

              {dados.documentoVeiculo && (
                <p className="driver-file-name">
                  ✓ {dados.documentoVeiculo}
                </p>
              )}

            </div>
          )}

        </div>

        <div className="driver-modal-footer">

          <button
            type="button"
            required
            className="driver-secondary-button"
            onClick={
              voltar
            }
          >
            {etapa === 1
              ? "Cancelar"
              : "Voltar"}
          </button>

          {etapa < 4 ? (
            <button
              type="button"
              className="driver-primary-button"
              onClick={
                avancar
              }
            >
              Continuar
              <span>
                →
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="driver-primary-button"
              onClick={
                finalizarCadastro
              }
            >
              Finalizar cadastro
              <span>
                ✓
              </span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default DriverRegisterModal;