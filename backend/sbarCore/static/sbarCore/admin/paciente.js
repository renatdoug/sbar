document.addEventListener('DOMContentLoaded', function () {
    const nascimentoInput = document.querySelector('#id_data_nascimento');
    if (nascimentoInput) {
      nascimentoInput.type = 'date';
    }
  
    const admissaoData = document.querySelector('#id_data_admissao_0');
    if (admissaoData) {
      admissaoData.type = 'date';
    }
    const admissaoHora = document.querySelector('#id_data_admissao_1');
    if (admissaoHora) {
      admissaoHora.type = 'time';
    }
  
    const altaData = document.querySelector('#id_data_alta_0');
    if (altaData) {
      altaData.type = 'date';
    }
    const altaHora = document.querySelector('#id_data_alta_1');
    if (altaHora) {
      altaHora.type = 'time';
    }
  });
  