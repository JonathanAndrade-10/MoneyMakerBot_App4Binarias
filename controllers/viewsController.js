const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const axios = require('axios').default;

const urlGetToken = process.env.ORCH_TOKEN_URL

const bodyGetToken = { 
  "grant_type": process.env.ORCH_GRANT_TYPE, 
  "client_id": process.env.ORCH_CLIENT_ID, 
  "refresh_token": process.env.ORCH_REFRESH_TOKEN 
}

const configGetToken = {
  headers: {
    'X-UIPATH-TenantName': process.env.ORCH_TENANT_NAME
  }
}

const urlAddQueueItem = process.env.ORCH_QUEUE_URL

const bodyAddQueueItem = { 
  "itemData": { 
      "Priority": process.env.ORCH_PRIORITY, 
      "Name": process.env.ORCH_QUEUE_NAME, 
      "SpecificContent": { 
          "Symbol@odata.type": "#String", 
          "Symbol": "%SYMBOL%", 
          "AlcistaBajista": "%ALCISTA_BAJISTA%", 
          "Duration": "%DURATION%", 
          "GoalPrice": "%GOAL_PRICE%",
          "CreateRemoveAlert": "Create"
      } 
  } 

}

const configAddQueueItem = {
  headers: {
    "X-UIPATH-OrganizationUnitId": process.env.ORCH_OUID,
    "Authorization": 'Bearer %ORCH_TOKEN%'
  }
}

exports.showForm = (req, res) => {
  res.status(200).render('form')
  // (`${__dirname}/../views/form.html`);
};

exports.createQueueItem = (req, res) => {
  
  bodyAddQueueItem.itemData.SpecificContent.Symbol = req.body.symbol;
  bodyAddQueueItem.itemData.SpecificContent.AlcistaBajista = req.body.alcistaBajista;
  bodyAddQueueItem.itemData.SpecificContent.Duration = req.body.duration;
  bodyAddQueueItem.itemData.SpecificContent.GoalPrice = req.body.goalPrice;

  axios.post(urlGetToken, bodyGetToken, configGetToken)
    .then( response => {
      var orchToken = response.data.access_token;
      configAddQueueItem.headers.Authorization =  configAddQueueItem.headers.Authorization.replace('%ORCH_TOKEN%', orchToken); 

      axios.post(urlAddQueueItem, bodyAddQueueItem, configAddQueueItem)
        .then( response => {
          console.log('Queue item created')

          res.status(200).render('itemCreated')

        })
        .catch( err => {
          console.log(err);
        })

    })
    .catch( err => {
      console.log(err.message);

      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    })
};
