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
  "data": {
    "classes": [
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
      "2E_INF",
      "2F_IDD"
    ],
    "hours": [
      ["08:00 - 09:00",1],
      ["09:00 - 10:00",2],
      ["10:00 - 11:00",3],
      ["11:00 - 12:00",4],
      ["12:00 - 12:50",5],
      ["12:50 - 13:40",6],
      ["13:40 - 14:30",7]
    ], 
    "days": [
      "DOMENICA",
      "LUNEDI",
      "MARTEDI",
      "MERCOLEDI",
      "GIOVEDI",
      "VENERDI",
      "SABATO"
    ]
  }
}

let extraRoomsCrudService = new CrudService(SERVICE_EXTRA_ROOMS_URL);
let availableRoomsCrudService = new CrudService(SERVICE_AVAILABLE_ROOMS_URL);

let classes;
let days;
let hours;

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
    createExtraRoomsTable(response);
    return true;
  }).then((response) => {
    return availableRoomsCrudService.get();
  }).then((response) => {
    classes = response.data.classes;
    days = response.data.days;
    hours = new Map(Array.from(response.data.hours, hour => hour.reverse()));
    console.info(`Rest API get ${classes.length} classes, ${days.length} days, ${hours.size} hours, rendering...`);
    return true;
  }).catch(error => {
    console.error(error);
    alert(`Network error: ${error.message}`);
  });
}

function createExtraRoomsTable(auleArray) {
  let form = document.querySelector("#extraRoomTable");
  if (form) {
    form.parentNode.removeChild(form);
  }

  addTemplate("#tabellaAule", "#extraRoomTableTemplate");
  document.querySelector("#addNewRoom").addEventListener("click", () => showRoom(-1, {}));
  
  console.info(`Rest API get ${auleArray.data.length} extra rooms, rendering...`);
  for (let i = 0; i<auleArray.data.length; i++) {
    let aula = auleArray.data[i];
    
    // add table rows
    addTemplate("#extraRoomTable", "#tableDataRowTemplate");
    replaceTemplateData('.tableDataRow:last-child', aula);
    
    const nodeSelected = document.querySelector('.tableDataRow:last-child');
    nodeSelected.addEventListener("click", () => showRoom(i, auleArray.data[i]));
  };
  
  const rootSelected = document.querySelector('#tabellaAule');
  rootSelected.rooms = auleArray.data;
  rootSelected.setAttribute("rooms", JSON.stringify(auleArray.data));
}

function showRoom(index, aula) {
  console.info(`Show extra room at index ${index}`);

  let form = document.querySelector("#formExtraAule");
  if (form) {
    form.parentNode.removeChild(form);
  }

  let aulaDaSalvare = {};

  addTemplate("#formAula", "#formExtraAuleTemplate");

  let dayInput = document.querySelector("#GiornoInputId");
  let oraInput = document.querySelector("#OraInputId");
  let classeInput = document.querySelector("#ClasseInputId");
  let roomInput = document.querySelector("#AulaInputId");
  let pianoInput = document.querySelector("#PianoInputId");

  bind(dayInput, 'value', aulaDaSalvare, 'Giorno');
  bind(oraInput, 'value', aulaDaSalvare, 'Ora');
  bind(classeInput, 'value', aulaDaSalvare, 'Classe');
  bind(roomInput, 'value', aulaDaSalvare, 'Aula');
  bind(pianoInput, 'value', aulaDaSalvare, 'Piano');

  populateSelectBoxByArrayValues('#ClasseInputId', classes, aulaDaSalvare.Classe);
  populateSelectBoxByMap('#OraInputId', hours, aulaDaSalvare.Ora);
  populateSelectBoxByArrayIndexed('#GiornoInputId', days, aulaDaSalvare.Giorno);

  console.debug(`index = ${index}`);
  if (index >= 0) {
    aulaDaSalvare.Extra = "SI";
    aulaDaSalvare.Giorno = aula.Giorno;
    aulaDaSalvare.Ora = aula.Ora;
    aulaDaSalvare.Classe = aula.Classe;
    aulaDaSalvare.Aula = aula.Aula;
    aulaDaSalvare.Piano = aula.Piano;
  }

  form = document.querySelector("#formExtraAule");
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (e.submitter.id === `saveButton`) {
      updateExtraRooms(index, aulaDaSalvare);
    }
    if (e.submitter.id === `deleteButton`) {
      cancellaAulaExtra(index, aulaDaSalvare);
    }
    
    let form = document.querySelector("#formExtraAule");
    if (form) {
      form.parentNode.removeChild(form);
    }
  });
}

function updateExtraRooms(index, aulaDaSalvare) {

  let aula = {}
  aula.Extra = "SI";
  aula.Giorno = aulaDaSalvare.Giorno;
  aula.Ora = aulaDaSalvare.Ora;
  aula.Classe = aulaDaSalvare.Classe;
  aula.Aula = aulaDaSalvare.Aula;
  aula.Piano = aulaDaSalvare.Piano;

  const rooms = document.querySelector('#tabellaAule').rooms;
  if (index === -1) {
    rooms.push(aula);
    console.info(`adding new extra room:`);
    console.dir(aula);
  }

  if (index >= 0) {
    rooms[index] = aula;
    console.info(`updating extra room at index ${index}`);
    console.dir(aula);
  }

  extraRoomsCrudService.post( { "data": rooms } )
  .then(() => {
    let form = document.querySelector("#formExtraAule");
    if (form) {
      form.parentNode.removeChild(form);
    }
    createExtraRoomsTable( { "data": rooms } );
    return true;
  }).catch(error => {
    console.error(error);
    alert(`Network error: ${error.message}`);
  });

}

function cancellaAulaExtra(index, aula) {
  const rooms = document.querySelector('#tabellaAule').rooms;
  rooms.splice(index, 1);
  console.info(`removing extra room at index ${index}:`);
  console.dir(aula);

  extraRoomsCrudService.post( { "data": rooms } )
  .then(() => {
    let form = document.querySelector("#formExtraAule");
    if (form) {
      form.parentNode.removeChild(form);
    }
    createExtraRoomsTable( { "data": rooms } );
    return true;
  }).catch(error => {
    console.error(error);
    alert(`Network error: ${error.message}`);
  });
}
