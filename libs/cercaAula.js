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

let roomMap = null;
let activityWeeklyMap = null;

const schoolMap = new Map();
const giorniSet = new Set();
const oreSet = new Set();

try {
  roomMap = createHourlyActivityMap(aule);
  activityWeeklyMap = createActivityWeeklyMap(timetable);
  populateSchoolMap(roomMap, schoolMap, giorniSet, oreSet);
  populateSelectBox("#Giorno", giorniSet);
  populateSelectBox("#Ora", oreSet);
  populateSelectBox("#Indirizzo", Array.from(schoolMap.keys()));
} catch (e) {
  console.error(e);
  if (e instanceof ValidationError) {
    console.dir(e.cause);
  }
}

document.querySelector("#Indirizzo").addEventListener("change", () => {
  updateAnniSelectbox(schoolMap);
});

document.querySelector("#Anno").addEventListener("change", () => {
  updateSezioniSelectbox(schoolMap);
});

document.querySelector("#cerca").addEventListener("click", () => cercaAula());

/**
 * Cerca l'aula
 */
function cercaAula() {
  try {
    let giorno = document.querySelector("#Giorno").value;
    let ora = document.querySelector("#Ora").value;
    let sezione = document.querySelector("#Sezione").value;
    let indirizzo = document.querySelector("#Indirizzo").value;
    let anno = document.querySelector("#Anno").value;

    let room = {
      Giorno: giorno,
      Ora: ora,
      Classe: anno + sezione + "_" + indirizzo
    };


    // creo chiave composta
    let key = getRoomKey(room);
    let activityFound = activityWeeklyMap.get(key);
    
    let aula = "Non trovata";
    if (activityFound && activityFound.Room) {
      aula = activityFound.Room;
    } else {
      let foundRoom = cercaAulaPer(giorno, ora, room.Classe, roomMap);
      if (foundRoom && foundRoom.Aula) {
        aula = foundRoom.Aula;
      }
    }

    document.querySelector("#aula").innerHTML = aula;
  } catch (e) {
    console.error(e);
  }
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

function createActivityWeeklyMap(timetable) {
  let classWeeklyMap = new Map();

  // Creo la mappa oraria degli insegnanti
  timetable.forEach(activity => {
    
    if (activity.Day && activity.Hour && activity['Students Sets']) {
  
      let room = {
        Giorno: activity.Day.trim().toUpperCase(),
        Ora: ORE_MAP.get(activity.Hour),
        Classe: activity['Students Sets'].trim().toUpperCase()
      };

      // creo chiave composta
      let key = getRoomKey(room);
      classWeeklyMap.set(key, activity);
    }
  });

  return classWeeklyMap;
}

/**
 * Crea la mappa (giorno_ora_classe, aula) per recuperare la classe.
 * La funzione 'getRoomKey' genera la chiave giorno_ora_classe
 * @param {List} activityList la lista di attivita'
 * @returns la mappa (giorno_ora_classe, aula, aule)
 */
function createHourlyActivityMap(activityList) {
  const roomMap = new Map();
  
  if (activityList) {
    activityList.forEach(room => {
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
 * Popola la mappa di indirizzi, sezioni e anni con i valori delle attivita'
 * @param {Map} roomMap la mappa delle attivita' 
 * @param {Map} roomMap la mappa della scuola, con indirizzi, anni e sezioni 
 * @param {Map} giorniSet i giorni
 * @param {Map} oreSet le ore
 */
function populateSchoolMap(roomMap, schoolMap, giorniSet, oreSet)  {
  if (roomMap) {

    roomMap.forEach( (room, key) => {
      if (room.Giorno) {
        giorniSet.add(room.Giorno);
      }
      if (room.Ora) {
        oreSet.add(room.Ora);
      }
      if (room.Classe) {
        let indirizzo = room.Classe.substr(3);
        let anniMap = schoolMap.get(indirizzo);
        if (! anniMap) {
          anniMap = new Map();
          // Associo indirizzo con mappa anni: inf -> [(1 -> x), (2 -> y), ...] 
          schoolMap.set(indirizzo, anniMap);
        }
        
        let anno = room.Classe.substr(0, 1);
        let sezioniMap = anniMap.get(anno);
        if (! sezioniMap) {
          sezioniMap = new Map();
          anniMap.set(anno, sezioniMap);
        }
        
        // Associo anno con insieme sezioni (1 -> [A, B, ...]) 
        let sezione = room.Classe.substr(1, 1);
        sezioniMap.set(sezione, 1);
      }
    });
  }
}

/**
 * Aggiorna la selectbox 'anni' nella pagina web
*/
function updateAnniSelectbox(schoolMap) {
  try {
    if (schoolMap) {
      let indirizzo = document.querySelector("#Indirizzo").value;

      if (indirizzo) {
        let anniMap = schoolMap.get(indirizzo);
        if (anniMap) {
          populateSelectBox("#Anno", Array.from(anniMap.keys()));
        }
      }

      populateSelectBox("#Sezione", new Array());
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Aggiorna la selectbox 'sezioni' nella pagina web
*/
function updateSezioniSelectbox(schoolMap) {
  try {
    if (schoolMap) {
      let indirizzo = document.querySelector("#Indirizzo").value;
      let anno = document.querySelector("#Anno").value;

      if (indirizzo) {
        let anniMap = schoolMap.get(indirizzo);
        if (anno) {
          let sezioni = anniMap.get(anno);
          if (sezioni) {
            populateSelectBox("#Sezione", Array.from(sezioni.keys()));
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Popola le selectbox.
 * @param {String} id l'identificativo della selectbox
 * @param {Set} valueSet il set di valori da inserire
 */
function populateSelectBox(id, valueSet) {
  let selectbox = document.querySelector(id);

  if (selectbox && selectbox.children) {
    Array.from(selectbox.children).forEach( elem => {
      elem.remove();
    });
  }

  valueSet.forEach( value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    selectbox.appendChild(option);
  })

  const defaultOption = document.createElement('option');
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.text = 'Seleziona';
  selectbox.add(defaultOption);
}
