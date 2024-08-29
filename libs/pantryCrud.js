const YOUR_PANTRY_ID="1fc033bf-3da6-4e2f-89dc-a47e79829456";
const PANTRY_EXTRA_ROOMS_BASKET="extraAule";
const PANTRY_AVAILABLE_ROOMS_BASKET="availableRooms";
const PANTRY_EXTRA_ROOMS_URL=`https://getpantry.cloud/apiv1/pantry/${YOUR_PANTRY_ID}/basket/${PANTRY_EXTRA_ROOMS_BASKET}`;
const PANTRY_AVAILABLE_ROOMS_URL=`https://getpantry.cloud/apiv1/pantry/${YOUR_PANTRY_ID}/basket/${PANTRY_AVAILABLE_ROOMS_BASKET}`;

const YOUR_NPOINT_ID="cb6d9d7728f81560283e";
const YOUR_NPOINT_DOC="extraAule";
const YOUR_NPOINT_DOC_URL=`https://api.npoint.io/${YOUR_NPOINT_ID}`;

const JSONSILO_EXTRA_ROOMS_ID="84aa0fca-a872-4866-982d-4a24cdb4f051";
const JSONSILO_EXTRA_ROOMS_URL=`https://api.jsonsilo.com/api/v1/manage/${JSONSILO_EXTRA_ROOMS_ID}`;

const JSONSILO_AVAILABLE_ROOMS_ID="89944785-b188-4924-aaad-b4114fa616cf";
const JSONSILO_AVAILABLE_ROOMS_URL=`https://api.jsonsilo.com/api/v1/manage/${JSONSILO_AVAILABLE_ROOMS_ID}`;

const SERVICE_EXTRA_ROOMS_URL=PANTRY_EXTRA_ROOMS_URL;
const SERVICE_AVAILABLE_ROOMS_URL=PANTRY_AVAILABLE_ROOMS_URL;

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
    return this.#httpCall(path, null, {method: 'GET'}).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      });
  }
  put(data={}, path="") {
    return this.#httpCall(path, JSON.stringify(data), {method: 'PUT'});
  }
  post(data={}, path="") {
    return this.#httpCall(path, JSON.stringify(data), {method: 'POST'});
  }
}
