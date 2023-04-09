export const nodejs = `const axios = require("axios");
const options = {
  method: 'POST',
  url: 'https://parallel.com/api/v1/parallel',
  params: {
    sample1: 'Draft me a legal subpoena for 1 760 935 5809. Ask for call logs on April 1 2023 and recordings if possible'
  },
  headers: {
    'Authorization': 'YOUR_API_KEY',
  }
};
  
axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});`

export const python = `import requests
url = 'https://parallel.com/api/v1/parallel'
api_key = 'YOUR_API_KEY'
sample1 = 'Draft me a legal subpoena for 1 760 935 5809. Ask for call logs on April 1 2023 and recordings if possible
headers = {
  'Authorization': api_key
}
payload = {
  'sample1': sample1
}
response = requests.post(url, headers=headers, json=payload)
if response.status_code == 200:
  data = response.json()
  print(data)
else:
  print(f'Request failed with status code {response.status_code}')`