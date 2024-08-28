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

mockClasses = {
  "data": [
    "2F_IDD",
    "2A_AER",
    "2A_EN",
    "2A_INF",
    "2A_MEC",
    "2A_OD",
    "2B_INF",
    "2B_MEC",
    "2B_OD",
    "2C_INF",
    "2D_INF",
    "2E_INF"
  ]  
}

let extraRoomsCrudService = new CrudService(SERVICE_EXTRA_ROOMS_URL);
let availableRoomsCrudService = new CrudService(SERVICE_AVAILABLE_ROOMS_URL);

document.querySelector("#getExtra").addEventListener("click", () => getExtraRooms());
document.querySelector("#putExtra").addEventListener("click", () => extraRoomsCrudService.put(mockData));
document.querySelector("#postExtra").addEventListener("click", () => extraRoomsCrudService.post(mockData));
document.querySelector("#resetExtra").addEventListener("click", () => extraRoomsCrudService.post(mockData));

// document.querySelector("#getExtra").addEventListener("click", () => populateForm());
// document.querySelector("#putExtra").addEventListener("click", () => extraRoomsCrudService.put(mockData));
// document.querySelector("#postExtra").addEventListener("click", () => extraRoomsCrudService.post(mockData));
document.querySelector("#resetAvailable").addEventListener("click", () => availableRoomsCrudService.post(mockClasses));


function getExtraRooms() {
  extraRoomsCrudService.get().then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  }).then((auleArray) => {
    createExtraRoomsTable(auleArray);
    return true;
  })
}

function createExtraRoomsTable(auleArray) {
  let form = document.querySelector("#table");
  if (form) {
    form.parentNode.removeChild(form);
  }

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
  aula.Classe = "6C_Tlc";

  addTemplate("#formAula", "#formExtraAuleTemplate");
  let form = document.querySelector("#formExtraAule");
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.dir(e.submitter.id);
    console.log(`submit ${e.submitter.id} stop`);

    if (e.submitter.id === `saveButton`) {
      updateExtraRooms(index, aula);
    }
    if (e.submitter.id === `deleteButton`) {
      cancellaAulaExtra(index, aula);
    }
    if (e.submitter.id === `undoButton`) {
      undoAulaExtra(index, aula);
    }
  });
} 

function updateExtraRooms(index, aula) {
  const rooms = document.querySelector('#tabellaAule').rooms;
  aula.Classe="6E_TLC";
  rooms[index] = aula;
  extraRoomsCrudService.post( { "data": rooms } );
}

function cancellaAulaExtra(index, aula) {
  const rooms = document.querySelector('#tabellaAule').rooms;
  rooms.splice(index, 1);
  extraRoomsCrudService.post( { "data": rooms } );
}

function undoAulaExtra() {
  console.debug("TODO undoAulaExtra");
}