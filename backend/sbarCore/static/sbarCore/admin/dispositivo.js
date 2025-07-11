document.addEventListener('DOMContentLoaded', function () {
    // Campo de seleção de tipo de dispositivo
    const tipoField = document.getElementById('id_tipo');
  
    // Container da linha do campo 'local_insercao' no Django Admin
    const localInsercaoRow = document.querySelector('.form-row.field-local_insercao');
  
    // Lista de tipos de dispositivos que não devem exibir o campo "local_insercao"
    const tiposSemLocal = ['SNE', 'SOG', 'TOT', 'TQT', 'SVD'];
  
    // Função que exibe ou oculta o campo com base no tipo selecionado
    function atualizarVisibilidadeCampo() {
      const tipoSelecionado = tipoField.value;
  
      if (tiposSemLocal.includes(tipoSelecionado)) {
        localInsercaoRow.style.display = 'none';
      } else {
        localInsercaoRow.style.display = '';
      }
    }
  
    // Garante que o campo seja ajustado ao carregar a página e sempre que o tipo mudar
    if (tipoField && localInsercaoRow) {
      atualizarVisibilidadeCampo();
      tipoField.addEventListener('change', atualizarVisibilidadeCampo);
    }
  });
  