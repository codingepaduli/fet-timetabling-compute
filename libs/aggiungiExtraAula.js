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
  extraRoomsCrudService.get().then((auleArray) => {
    createExtraRoomsTable(auleArray);
    return true;
  }).then((response) => {
    return availableRoomsCrudService.get();
  }).then((response) => {
    classes = response.data.classes;
    days = response.data.days;
    hours = new Map(Array.from(response.data.hours, hour => hour.reverse()));
  });
}

function createExtraRoomsTable(auleArray) {
  let form = document.querySelector("#extraRoomTable");
  if (form) {
    form.parentNode.removeChild(form);
  }

  addTemplate("#tabellaAule", "#extraRoomTableTemplate");
  document.querySelector("#addNewRoom").addEventListener("click", () => showRoom(-1, {}));

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
  let aulaDaSalvare = {};

  addTemplate("#formAula", "#formExtraAuleTemplate");
  
  populateSelectBoxByArrayValues('#ClasseInputId', classes, "2A_AER");
  populateSelectBoxByMap('#OraInputId', hours, "1");
  populateSelectBoxByArrayIndexed('#GiornoInputId', days);

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
  
  aulaDaSalvare.Extra = "SI";
  aulaDaSalvare.Giorno = 3;
  aulaDaSalvare.Ora = 3;
  aulaDaSalvare.Classe="2A_AER";
  aulaDaSalvare.Aula=4;
  aulaDaSalvare.Piano = 543;

  if (index >= 0) {
    aulaDaSalvare.Giorno = aula.Giorno;
    aulaDaSalvare.Ora = aula.Ora;
    aulaDaSalvare.Classe = aula.Classe;
    aulaDaSalvare.Aula = aula.Aula;
    aulaDaSalvare.Piano = aula.Piano;
  }

  let form = document.querySelector("#formExtraAule");
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.dir(aulaDaSalvare);

    console.dir(e.submitter.id);
    console.log(`submit ${e.submitter.id} stop`);

    if (e.submitter.id === `saveButton`) {
      updateExtraRooms(index, aulaDaSalvare);
    }
    if (e.submitter.id === `deleteButton`) {
      cancellaAulaExtra(index, aulaDaSalvare);
    }
    if (e.submitter.id === `undoButton`) {
      undoAulaExtra(index, aulaDaSalvare);
    }
  });
}

function updateExtraRooms(index, aula) {

  console.log(index);

  let aulaDaSalvare = {}
  aulaDaSalvare.Extra = aula.Extra;
  aulaDaSalvare.Giorno = aula.Giorno;
  aulaDaSalvare.Ora = aula.Ora;
  aulaDaSalvare.Classe = aula.Classe;
  aulaDaSalvare.Aula = aula.Aula;
  aulaDaSalvare.Piano = aula.Piano;

  const rooms = document.querySelector('#tabellaAule').rooms;
  if (index === -1) {
    rooms.push(aulaDaSalvare);
  }

  if (index > 0) {
    rooms[index] = aulaDaSalvare;
  }

  extraRoomsCrudService.post( { "data": rooms } );
}

function cancellaAulaExtra(index, aula) {
  const rooms = document.querySelector('#tabellaAule').rooms;
  rooms.splice(index, 1);
  extraRoomsCrudService.post( { "data": rooms } );
}

function undoAulaExtra(index, aula) {
  console.debug(`Aula prop was ${aula.Aula}`);
  aula.Aula ++;
  console.debug("TODO undoAulaExtra");
}
