const GIORNI = ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ", "SABATO", "DOMENICA"];

const ORE_MAP = new Map();
ORE_MAP.set("08:00 - 09:00", 1);
ORE_MAP.set("09:00 - 10:00", 2);
ORE_MAP.set("10:00 - 11:00", 3);
ORE_MAP.set("11:00 - 12:00", 4);
ORE_MAP.set("12:00 - 12:50", 5);
ORE_MAP.set("12:50 - 13:40", 6);
ORE_MAP.set("13:40 - 14:30", 7);

class ValidationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ValidationError";
    this.cause = cause;
  }
}

document.querySelector("#trovaAula select").addEventListener(onchange, () => cercaAula());

let roomMap = null;
try {
  roomMap = createHourlyActivityMap(aule);
  populateSelectBoxes(roomMap);
} catch (e) {
  console.error(e);
  if (e instanceof ValidationError) {
    console.dir(e.cause);
  }
}
/**
 * Cerca l'aula
 */
function cercaAula() {
  let giorno = document.querySelector("#Giorno").value;
  let ora = document.querySelector("#Ora").value;
  let sezione = document.querySelector("#Sezione").value;
  let anno = document.querySelector("#Anno").value;

  let roomFound = cercaAulaPer(giorno, ora, anno + sezione, roomMap);

  document.querySelector("#aula").innerHTML = roomFound ? roomFound.Aula : "Non trovata";
}

function cercaAulaPer(giorno, ora, classe, roomMap) {
  let roomFound = null;

  if (roomMap) {

    let record = {
      Extra: "SI",
      Giorno: giorno,
      Ora: ora,
      Classe: classe
    };

    // Cerca le attivita' per priorita'
    let key = getRoomKey(record);
    console.info("Cerco per chiave " + key);

    roomFound = roomMap.get(key);

    if (!roomFound) {
      console.info("Non trovata per " + key);
      record.Extra = null;
      key = getRoomKey(record);
      roomFound = roomMap.get(key);

      if (!roomFound) {
        console.info("Non trovata per " + key);
        record.Ora = null;
        key = getRoomKey(record);
        roomFound = roomMap.get(key);

        if (!roomFound) {
          console.info("Non trovata per " + key);
          record.Giorno = null;
          key = getRoomKey(record);
          roomFound = roomMap.get(key);

          if (roomFound) {
            console.info("Trovata per " + key)
          } else {
            console.warn("Non trovata per " + key);
          }
        }
      }
    }
  }
  return roomFound;
}

/**
 * Crea la mappa (giorno_ora_classe, aula) per recuperare la classe.
 * La funzione 'getRoomKey' genera la chiave giorno_ora_classe
 * @param {List} roomList la lista di attivita'
 * @returns la mappa (giorno_ora_classe, aula, aule)
 */
function createHourlyActivityMap(roomList) {
  const roomMap = new Map();
  
  if (roomList) {
    roomList.forEach(room => {
      let validRoom = validateRoom(room);

      let key = getRoomKey(validRoom);
      roomMap.set(key, validRoom);
    });
  }
  return roomMap;
}

/**
 * Valida un'attivita' e sistema i campi Classe, Giorno, Ora, Aula ed Extra.
 * @param {Room} room 
 * @returns {Room} L'attivita' con i campi sistemati
 * @throws Error when a field is missing
 * @throws RangeError Giorno sconosciuto o ora non gestita
 */
function validateRoom(room) {
  if (! room) {
    throw new ValidationError("Riga vuota", null);
  }
  if (room.Classe) {
    room.Classe = room.Classe.trim().toUpperCase();
  } else {
    throw new ValidationError("Classe mancante", room);
  }

  if (room.Giorno) {
    room.Giorno = room.Giorno.trim().toUpperCase();
    if ( ! GIORNI.includes(room.Giorno)) {
      throw new ValidationError("Giorno sconosciuto: " + room.Giorno, room);
    }
  } // Giorno mancante, significa tutti i giorni

  if (room.Ora) {
    room.Ora = parseInt(room.Ora, 10); //parse base 10
    if (room.Ora < 1 || room.Ora > 7) {
      throw new RangeError("Ora non gestita: " + room.Ora, room);
    }
  } // Ora mancante, significa tutte le ore

  if (room.Aula) {
    room.Aula = room.Aula.trim().toUpperCase();
  } // Aula mancante, potrebbe essere "itinerante"

  if (room.Extra) {
    room.Extra = room.Extra.trim().toUpperCase();
  } // Aula mancante, potrebbe essere "itinerante"

  return room;
}

/**
 * Genera la chiave di ricerca di una classe. 
 * Il formato della chiave e' 'extra_giorno_ora_classe', con:
 * - extra - facoltativo;
 * - giorno - facoltativo;
 * - ora - facoltativo;
 * - classe - obbligatorio;
 * La precedenza e' 'extra_giorno_ora_classe', 
 * poi al formato 'giorno_ora_classe'
 * poi al formato 'giorno__classe'
 * infine al formato '__classe'
 * @param {Room} room le informazioni sulla classe e aula' 
 * @returns la chiave di ricerca per priorita'
 */
function getRoomKey(room) {
  let key = "";
  if (room) {
    if (room.Classe) {
      key = "_" + "_" + room.Classe;
      if (room.Giorno) {
        key = room.Giorno + "_" + room.Classe;
        if (room.Ora) {
          key = room.Giorno + "_" + room.Ora + "_" + room.Classe;
        }
      }
    }
    // Questo campo ha sempre la priorita' nella ricerca
    if (room.Extra) {
      key = room.Extra + "_" + key;
    }
  }
  return key;
}

/**
 * Popola tutte le selectbox con i valori delle attivita'
 * @param {Map} roomMap la mappa delle attivita' 
 */
function populateSelectBoxes(roomMap)  {
  if (roomMap) {
    let giorniSet = new Set();
    let oreSet = new Set();
    let sezioniSet = new Set();
    let anniSet = new Set();

    roomMap.forEach( (room, key) => {
      if (room.Giorno) {
        giorniSet.add(room.Giorno);
      }
      if (room.Ora) {
        oreSet.add(room.Ora);
      }
      if (room.Classe) {
        sezioniSet.add(room.Classe.substr(1));
        anniSet.add(room.Classe.substr(0, 1));
      }
    });

    populateSelectBox("#Giorno", giorniSet);
    populateSelectBox("#Ora", oreSet);
    populateSelectBox("#Sezione", sezioniSet);
    populateSelectBox("#Anno", anniSet);
  }
}

/**
 * Popola le selectbox.
 * @param {String} id l'identificativo della selectbox
 * @param {Set} valueSet il set di valori da inserire
 */
function populateSelectBox(id, valueSet) {
  let selectbox = document.querySelector(id);

  valueSet.forEach( value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    selectbox.appendChild(option);
  })
}

//generateRoomsTable(roomMap);
//createLabHoursMap(timetable, roomMap);
//createTeacherWeeklyMap(timetable, roomMap);
createClassWeeklyMap(timetable, roomMap);

/** ************************ **/
function generateRoomsTable(roomMap) {
  if (roomMap) {
    let table = document.createElement("table");
    
    roomMap.forEach( (value, key, map) => {
      let row = document.createElement("tr");

      if (key && value && value.Classe) {
        let classCell = document.createElement("td");
        classCell.innerText = key;
        let roomCell = document.createElement("td");
        roomCell.innerText = value.Aula;
        row.appendChild(classCell);
        row.appendChild(roomCell);
      }
      table.appendChild(row);
    });

    document.querySelector("body").append(table);
  }
}

function createLabHoursMap(timetable, roomMap) {
  const roomsList = new Set();
  const daysSet = new Set();
  const hoursSet = new Set();
  const labHoursMap = new Map();
  let   hoursList = new Array();
  let   daysList = new Array();
  
  if (timetable) {

    // Creo la mappa dell'occupazione delle classi
    timetable.forEach(activity => {

      if (activity.Room && activity.Day && activity.Hour) {
        roomsList.add(activity.Room);
        daysSet.add(activity.Day);
        hoursSet.add(activity.Hour);
        
        // creo chiave composta
        let key = activity.Room + "_" + activity.Day + "_" + activity.Hour;
        labHoursMap.set(key, activity);
      }

      // ordino gli array
      hoursList = Array.from(hoursSet);
      daysList = Array.from(daysSet);
      hoursList.sort();
      daysList.sort();
    });

    // Visualizzo la mappa dell'occupazione delle classi
    roomsList.forEach( room => {
      let table = document.createElement("table");
      let caption = table.createCaption();
      caption.textContent = " " + room;

      hoursList.forEach( hour => {
        let row = document.createElement("tr");
        
        daysList.forEach( day => {
          
          // get the activity
          let key = room + "_" + day + "_" + hour;
          activity = labHoursMap.get(key);
          
          // get the class from the activity
          let students = activity ? activity["Students Sets"] : " ";
          students = students.toUpperCase();
          
          // get the room of the class
          let record = { 
            Classe: students
          }
        
          // Cerca le attivita' per priorita'
          let roomKey = getRoomKey(record);
          console.info("Cerco il numero d'aula per chiave " + roomKey);

          let roomNumber = roomMap.get(roomKey) ? roomMap.get(roomKey).Aula : " NO ";
          
          let cell = document.createElement("td");
          cell.innerHTML = (activity ? activity?.Day + " " + activity?.Hour + " " + activity?.Teachers + " " + activity["Students Sets"] + " " + " da aula " + " <mark>" + roomNumber + "</mark>" : ""); // " <mark>Empty " + key + "</mark>");
          row.appendChild(cell);
        });
        table.appendChild(row);
      });
      document.querySelector("body").append(table);
    });
  }
  return roomMap;
}

function createTeacherWeeklyMap(timetable, roomMap) {
  const daysSet = new Set();
  const hoursSet = new Set();
  const teacherSet = new Set();
  let   daysList = new Array();
  let   hoursList = new Array();
  let   teacherList = new Array();
  const teacherWeeklyMap = new Map();
  
  if (timetable) {

    // Creo la mappa oraria degli insegnanti
    timetable.forEach(activity => {

      if (activity.Day && activity.Hour && activity.Teachers) {
        daysSet.add(activity.Day.trim().toUpperCase());
        hoursSet.add(activity.Hour);

        if (activity.Teachers) {
          let teachers = activity.Teachers.split("+");
          teachers.forEach(teacher => { 
            teacherSet.add(teacher);

            clonedActivity = structuredClone(activity);
            clonedActivity.Teachers = teacher;

            // creo chiave composta
            let key = teacher + "_" + activity.Day.trim().toUpperCase() + "_" + activity.Hour;
            teacherWeeklyMap.set(key, clonedActivity);
          });
        }
      }

      // ordino gli array
      hoursList = Array.from(hoursSet);
      daysList = Array.from(daysSet);
      teacherList = Array.from(teacherSet);
      hoursList.sort();
      daysList.sort();
      teacherList.sort();
    });

    // Visualizzo la mappa dell'occupazione delle classi
    let table = document.createElement("table");

    let headerRow = document.createElement("tr");
    let headerCell = document.createElement("td");
    headerCell.innerHTML = "<strong>Docente</strong>";
    headerRow.appendChild(headerCell);

    // creo l'intestazione
    daysList.forEach( day => {
      hoursList.forEach( hour => {
        headerCell = document.createElement("td");
        headerCell.innerHTML = day + " " + ORE_MAP.get(hour);
        headerRow.appendChild(headerCell);
      });
    });
    table.appendChild(headerRow);

    teacherList.forEach( teacher => {
      
      let row = document.createElement("tr");
      let teacherCell = document.createElement("td");
      teacherCell.innerHTML = teacher;
      row.appendChild(teacherCell);
  
      daysList.forEach( day => {
        let teacherCell = document.createElement("td");

        hoursList.forEach( hour => {
          let hourCell = document.createElement("td");
          hourCell.innerHTML = "";

          let key = teacher + "_" + day + "_" + hour;
          let activity = teacherWeeklyMap.get(key);

          if (activity) {
            let teacherClass = activity['Students Sets'];

            let foundRoom = cercaAulaPer(day, ORE_MAP.get(hour), teacherClass, roomMap);
            hourCell.innerHTML = (foundRoom ? foundRoom.Classe + " <mark>" + foundRoom.Aula + "</mark>" : " ");
          }

          row.appendChild(hourCell);
        });
      });
      table.appendChild(row);
    });
    document.querySelector("body").append(table);
  }
}


function createClassWeeklyMap(timetable, roomMap) {
  const daysSet = new Set();
  const hoursSet = new Set();
  const classSet = new Set();
  let   daysList = new Array();
  let   hoursList = new Array();
  let   classList = new Array();
  const classWeeklyMap = new Map();

  
  if (timetable) {

    // Creo la mappa oraria degli insegnanti
    timetable.forEach(activity => {

      if (activity.Day && activity.Hour && activity['Students Sets']) {
        daysSet.add(activity.Day.trim().toUpperCase());
        hoursSet.add(activity.Hour);
        classSet.add(activity['Students Sets'].trim().toUpperCase());

        // creo chiave composta
        let key = activity['Students Sets'].trim().toUpperCase() + "_" + activity.Day.trim().toUpperCase() + "_" + activity.Hour;
        classWeeklyMap.set(key, activity);
      }

      // ordino gli array
      hoursList = Array.from(hoursSet);
      daysList = Array.from(daysSet);
      classList = Array.from(classSet);
      hoursList.sort();
      daysList.sort();
      classList.sort();
    });

    // Visualizzo la mappa dell'occupazione delle classi
    let table = document.createElement("table");

    let headerRow = document.createElement("tr");
    let headerCell = document.createElement("td");
    headerCell.innerHTML = "<strong>Classe</strong>";
    headerRow.appendChild(headerCell);

    // creo l'intestazione
    daysList.forEach( day => {
      hoursList.forEach( hour => {
        headerCell = document.createElement("td");
        headerCell.innerHTML = day + " " + ORE_MAP.get(hour);
        headerRow.appendChild(headerCell);
      });
    });
    table.appendChild(headerRow);

    classList.forEach( classe => {
      
      let row = document.createElement("tr");
      let classeCell = document.createElement("td");
      classeCell.innerHTML = classe;
      row.appendChild(classeCell);
  
      daysList.forEach( day => {

        hoursList.forEach( hour => {
          let hourCell = document.createElement("td");
          hourCell.innerHTML = "";

          let key = classe.trim().toUpperCase() + "_" + day.trim().toUpperCase() + "_" + hour;

          let activityFound = classWeeklyMap.get(key);

          let aula = "Non trovata";
          if (activityFound && activityFound.Room) {
            aula = activityFound.Room;
          } else {
            let foundRoom = cercaAulaPer(day, ORE_MAP.get(hour), classe, roomMap);
            aula = foundRoom.Aula;
          }

          hourCell.innerHTML = aula;
          row.appendChild(hourCell);
        });
      });
      table.appendChild(row);
    });
    document.querySelector("body").append(table);
  }
}
