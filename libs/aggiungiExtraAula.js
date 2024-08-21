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
      "Giorno": "MAR",
      "Ora": "2°",
      "Classe": "4A_INF",
      "Aula": "12345"
    },
    {
      "Extra": "NO",
      "Giorno": "MER",
      "Ora": "2°",
      "Classe": "4A_INF",
      "Aula": "12345"
    },
    {
      "Extra": "NO",
      "Giorno": "GIO",
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

  for (let i = 0; i<auleArray.data.length; i++) {
    let aula = auleArray.data[i];
    
    // add table rows
    addTemplate("#table", "#tableDataRowTemplate");
    replaceTemplateData('.tableDataRow:last-child', aula);
    
    const nodeSelected = document.querySelector('.tableDataRow:last-child');
    nodeSelected.addEventListener("click", () => showRoom(i, auleArray.data[i]));
  };
  
  const rootSelected = document.querySelector('#tabellaAule');
  rootSelected.rooms = auleArray.data;
  rootSelected.setAttribute("rooms", JSON.stringify(auleArray.data));

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

function replaceTemplateData(dataNodeSelector, dataToReplace={}) {
  if (typeof dataNodeSelector !== 'string' && ! (dataNodeSelector instanceof String) ) {
    throw new Error("param 'dataNodeSelector' is not a string");
  }
  if (!dataToReplace instanceof Object || Array.isArray(dataToReplace) || dataToReplace === null) {
    throw new Error("param 'dataToReplace' is not an object (empty object is allowed)");
  }

  const nodeToReplace = document.querySelectorAll(dataNodeSelector + " .replaceData");
  console.debug(`Found ${nodeToReplace.length} elements to replace in node ${dataNodeSelector}`);

  nodeToReplace.forEach(node => {
    Object.entries(dataToReplace).forEach(([key, val]) => {
      console.debug(`Replacing \$\{${key}\} --> ${val}`);
      node.textContent = node.textContent.replace(`\$\{${key}\}` , `${val}`);
    });
  });
}

function showRoom(index, aula) {
  console.log(aula);
  aula.Classe = "6C_Tlc"
  salvaAule(index, aula);
} 

function salvaAule(index, aula) {
  const rooms = document.querySelector('#tabellaAule').rooms;
  console.dir(rooms);

  aula.Classe = "6C_Tlc"
  rooms[index] = aula;
  crudService.post( { "data": rooms } );
}