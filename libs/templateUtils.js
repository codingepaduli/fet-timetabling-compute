
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
      console.trace(`Replacing \$\{${key}\} --> ${val}`);
      node.textContent = node.textContent.replace(`\$\{${key}\}` , `${val}`);
    });
  });
}

/**
 * Popola le selectbox.
 * 
 * @param {String} id l'identificativo della selectbox
 * @param {array} arrayValue l'array di valori da inserire
 * @param {String} defaultKey il valore di default
 */
function populateSelectBoxByArrayValues(id, arrayValue, defaultKey=null) {
  const valueMap = new Map(arrayValue.map((value, index) => [value, value]));
  populateSelectBoxByMap(id, valueMap, defaultKey=null);
}

/**
 * Popola le selectbox.
 * 
 * @param {String} id l'identificativo della selectbox
 * @param {array} arrayIndexed l'array di valori da inserire
 * @param {String} defaultKey il valore di default
 */
function populateSelectBoxByArrayIndexed(id, arrayIndexed, defaultKey=null) {
  const valueMap = new Map(arrayIndexed.map((value, index) => [index, value]));
  populateSelectBoxByMap(id, valueMap, defaultKey=null);
}

/**
 * Popola le selectbox.
 * 
 * @param {String} id l'identificativo della selectbox
 * @param {Map} keyValueMap la mappa di valori da inserire
 * @param {String} defaultKey il valore di default
 */
function populateSelectBoxByMap(id, keyValueMap, defaultKey=null) {
  console.debug(`populating selectbox ${id}`);
  let selectbox = document.querySelector(id);

  if (selectbox && selectbox.children) {
    Array.from(selectbox.children).forEach( elem => {
      elem.remove();
    });
  }
  
  const defaultOption = document.createElement('option');
  defaultOption.disabled = true;
  defaultOption.text = 'Seleziona';
  selectbox.add(defaultOption);

  let valueSelected = false;
  
  keyValueMap.forEach((value, key) => { 
    const option = document.createElement('option');
    option.value = key;
    option.textContent = value;

    console.trace(`${key} --> ${value}`);

    if (option.value === defaultKey) {
      console.trace("initialValue: " + value);

      option.selected = true;
      valueSelected = true;
    }
    selectbox.appendChild(option);
  })

  if ( ! valueSelected) {
    defaultOption.selected = true;
  }
}

/*
<input type="text" id="someID">

var el = document.getElementById("someID")
var obj = new some_class();
bind(el,'value',obj,'variable');

p.variable="yes"
 */
function bind(el, attribute, obj, varname) {
  console.trace(`field ${el.id} bound to property ${varname}`);
  Object.defineProperty(obj, varname, {
      get: () => {
        console.debug(`getting from ${el.id}.${attribute}: ` + el[`${attribute}`]);
        return el[`${attribute}`];
      },
      set: (value) => {
        console.debug(`setting ${el.id}.${attribute}=${value}, erasing value ` + el[`${attribute}`]);
        el[`${attribute}`] = value;
      }
  })
}

// How to JSON a Map (don't with nested maps)
// jsonText = JSON.stringify(Array.from(MAP.entries()));
// new Map(JSON.parse(jsonText));

// To start with a Promise:
// new Promise((resolve) => {
//   console.log('Resolving this');
//   resolve("Resolving this");
// }).then ...
