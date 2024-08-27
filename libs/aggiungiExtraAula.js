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

let extraRoomsCrudService = new CrudService(SERVICE_EXTRA_ROOMS_URL);

document.querySelector("#get").addEventListener("click", () => populateForm());
document.querySelector("#put").addEventListener("click", () => extraRoomsCrudService.put(mockData));
document.querySelector("#post").addEventListener("click", () => extraRoomsCrudService.post(mockData));

function populateForm() {
  extraRoomsCrudService.get().then((response) => {
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
  extraRoomsCrudService.post( { "data": rooms } );
}