document.addEventListener('DOMContentLoaded', async () => {
  const urlsContainer = document.getElementById('urls-container');
  const copyButton = document.getElementById('copyUrls');
  const toggleAllButton = document.getElementById('toggleAll');
  let allSelected = true; // Começa com TRUE porque todas estão selecionadas por padrão
  toggleAllButton.textContent = 'Deselecionar Todas'; // ✅ Corrigido: Mostra estado correto desde o início
  // Carrega todas as abas
  const tabs = await chrome.tabs.query({});

  // Cria checkboxes para cada URL
  tabs.forEach(tab => {
    const urlItem = document.createElement('div');
    urlItem.className = 'url-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.id = `url-${tab.id}`;
    checkbox.dataset.url = tab.url; // Armazena a URL completa

    const label = document.createElement('label');
    label.htmlFor = `url-${tab.id}`;
    label.textContent = tab.url.length > 60
      ? `${tab.url.substring(0, 60)}...`
      : tab.url;

    urlItem.appendChild(checkbox);
    urlItem.appendChild(label);
    urlsContainer.appendChild(urlItem);
  });

  // Botão "Selecionar/Deselecionar Todas"
  toggleAllButton.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = !allSelected;
    });
    allSelected = !allSelected;
    toggleAllButton.textContent = allSelected ? 'Deselecionar Todas' : 'Selecionar Todas';
  });

  // Copia URLs selecionadas
  copyButton.addEventListener('click', () => {
    const selectedUrls = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.dataset.url); // Pega a URL completa

    if (selectedUrls.length === 0) {
      alert('Nenhuma URL selecionada!');
      return;
    }

    navigator.clipboard.writeText(selectedUrls.join('\n'));
    alert(`${selectedUrls.length} URLs copiadas!`);
  });
});
