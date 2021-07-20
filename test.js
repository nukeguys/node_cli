const fetch = require("node-fetch");

fetch(
  "https://podotree.atlassian.net/rest/api/2/project/11078/version?query=WEB v3.1.0.5 QA6",
  {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(
        "lucas.sung@kakaoent.com:Ce5G27yczaCxJEQyc2t28BC7"
      ).toString("base64")}`,
      Accept: "application/json",
    },
  }
)
  .then(response => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));
