const YOUR_PANTRY_ID="1fc033bf-3da6-4e2f-89dc-a47e79829456";
const YOUR_PANTRY_BASKET="extraAule";
const YOUR_PANTRY_BASKET_URL=`https://getpantry.cloud/apiv1/pantry/${YOUR_PANTRY_ID}/basket/${YOUR_PANTRY_BASKET}`;

const YOUR_NPOINT_ID="cb6d9d7728f81560283e";
const YOUR_NPOINT_DOC="extraAule";
const YOUR_NPOINT_DOC_URL=`https://api.npoint.io/${YOUR_NPOINT_ID}`;

const YOUR_JSONSILO_ID="84aa0fca-a872-4866-982d-4a24cdb4f051";
const YOUR_JSONSILO_URL=`https://api.jsonsilo.com/api/v1/manage/${YOUR_JSONSILO_ID}`;

const SERVICE_URL=YOUR_PANTRY_BASKET_URL;

class CrudService {
  constructor(url) {
    this.url=url;
  }

  #httpCall(path, data, requestOptions={}, httpHeader={}) {
    var reqOptions = {
      headers: {"Content-Type": "application/json", ...httpHeader},
      redirect: 'follow',
      ...requestOptions
    };
    if (data) {
      reqOptions.body=data;
    }
    return fetch([this.url, path].join(' '), reqOptions);
  }

  get(path="") {
    // ADD header {"X-MAN-API": "extraClass"}
    return this.#httpCall(path, null, {method: 'GET'});
  }
  put(data={}, path="") {
    return this.#httpCall(path, JSON.stringify(data), {method: 'PUT'});
  }
  post(data={}, path="") {
    return this.#httpCall(path, JSON.stringify(data), {method: 'POST'});
  }
}

crudService = new CrudService(SERVICE_URL);

function get() {
  var raw = "";
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  fetch(SERVICE_URL, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function put() {
  var raw = JSON.stringify({
    "obj": "value"
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(SERVICE_URL, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}