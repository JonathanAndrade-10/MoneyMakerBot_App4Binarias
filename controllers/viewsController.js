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

const bodyAddQueueItemBase = { 
  "itemData": { 
      "Priority": process.env.ORCH_PRIORITY, 
      "Name": process.env.ORCH_QUEUE_NAME, 
      "SpecificContent": { 
          "CreateRemoveAlert@odata.type": "#String" 
          // "Symbol": "%SYMBOL%", 
          // "AlcistaBajista": "%ALCISTA_BAJISTA%", 
          // "Duration": "%DURATION%", 
          // "GoalPrice": "%GOAL_PRICE%",
          // "CreateRemoveAlert": "%CREATE_REMOVE_ALERT%"
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
  
};

exports.createQueueItem = (req, res) => {
  var bodyAddQueueItem = JSON.parse(JSON.stringify(bodyAddQueueItemBase));

  if(!req.body.symbolRemove)   // It is a create request
  {
    bodyAddQueueItem.itemData.SpecificContent['Symbol'] = req.body.symbol;
    bodyAddQueueItem.itemData.SpecificContent['AlcistaBajista'] = req.body.alcistaBajista;
    bodyAddQueueItem.itemData.SpecificContent['Duration'] = req.body.duration;
    bodyAddQueueItem.itemData.SpecificContent['GoalPrice'] = req.body.goalPrice;
    bodyAddQueueItem.itemData.SpecificContent['CreateRemoveAlert'] = 'Create';
  }
  else if (req.body.symbolRemove === 'All') // It is a remove all request
  {
    bodyAddQueueItem.itemData.SpecificContent['CreateRemoveAlert'] = 'RemoveAll';
  }
  else    // It is a remove one alert request
  {
    bodyAddQueueItem.itemData.SpecificContent['Symbol'] = req.body.symbolRemove;
    bodyAddQueueItem.itemData.SpecificContent['CreateRemoveAlert'] = 'Remove';
  }

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
          console.log(err.message);
          res.status(400).json({
            status: 'fail',
            message: err.message
          });
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
