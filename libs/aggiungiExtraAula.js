mockData={
  "data": [
    {
      "Extra": "SI",
      "Giorno": "LUNEDI",
      "Ora": "1°",
      "Classe": "4A_INF",
      "Aula": "123",
      "Piano": null
    },
    {
      "Extra": "NO",
      "Giorno": "LUNEDI",
      "Ora": "2°",
      "Classe": "4A_INF",
      "Aula": "12345"
    },
    {
      "Extra": "NO",
      "Giorno": "LUNEDI",
      "Ora": "2°",
      "Classe": "4A_INF",
      "Aula": "12345"
    },
    {
      "Extra": "NO",
      "Giorno": "LUNEDI",
      "Ora": "2°",
      "Classe": "4A_INF",
      "Aula": "12345"
    }
  ]
};

document.querySelector("#get").addEventListener("click", () => populateForm());
document.querySelector("#put").addEventListener("click", () => crudService.put(mockData));
document.querySelector("#post").addEventListener("click", () => crudService.post(mockData));

function populateForm() {
  crudService = new CrudService(SERVICE_URL);
  crudService.get().then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  }).then((auleArray) => {
    createTable(auleArray);
    return true;
  })
}

function createTable(auleArray) {
  addTemplate("#tabellaAule", "#tableTemplate");

  auleArray.data.forEach((aula) => {
    // add table rows
    addTemplate("#table", "#tableDataRowTemplate");
    replaceTemplateData('#tableDataRow', aula)
  });
}

function addTemplate(targetId, templateID) {
  if (typeof targetId !== 'string' && ! (targetId instanceof String) ) {
    throw new Error("param 'targetId' is not a string");
  }
  if (typeof templateID !== 'string' && ! (templateID instanceof String) ) {
    throw new Error("param 'templateID' is not a string");
  }
  
  const target = document.querySelector(targetId);
  const template = document.querySelector(templateID);
  
  if (target != null && template != null) {
    target.append(template.content.cloneNode(true));
  }
}

function replaceTemplateData(dataNodesID, dataToReplace={}) {
  if (typeof dataNodesID !== 'string' && ! (dataNodesID instanceof String) ) {
    throw new Error("param 'targetId' is not a string");
  }
  if (!dataToReplace instanceof Object || Array.isArray(dataToReplace) || dataToReplace === null) {
    throw new Error("param 'dataToReplace' should be undefined or an object (empty object is allowed)");
  }

  const nodeToReplace = document.querySelectorAll(dataNodesID + " .replaceData");
  console.debug(`Found ${nodeToReplace.length} elements to replace in node ${dataNodesID}`);

  nodeToReplace.forEach(node => {
    Object.entries(dataToReplace).forEach(([key, val]) => {
      console.debug(`Replacing \$\{${key}\} --> ${val}`);
      node.textContent = node.textContent.replace(`\$\{${key}\}` , `${val}`);
    });
  });
}
