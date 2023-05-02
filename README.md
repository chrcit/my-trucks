# Coding Challenge

thanks for taking the time to work on our coding challenge. the goal of this challenge is to asses your overall ability to build a feature. feel free to be creative.

## about

the logistics managers of one of our clients want to be able to view the status of their trucks on a simple dashboard like screen. The data is provided by a webservice from the logistics company. (we are aworking on actual logistics related project with a client, hence the topic for this exercise).

### what you should build

- create a page which displays a list of all trucks currently in the system
- display the count of trucks total, status onroute and status idle as KPIs

### how to get the data from the webservice

`GET https://node-challenge.functn.workers.dev/`

e.g the api supports CORS so you can fetch directly from the browser

the webservice will return a simple array of trucks

```json
[
  {
    "id": 1,
    "name": "Truck 1",
    "position": [47.751394768797404, 16.14841275234999],
    "positionLabel": "Wien",
    "status": "onroute"
  }
]
```

### nice to haves

- add a filter or search
- make a card / grid like layout
- should work on mobile
- make it look nice, but keep it simple

## FAQs

### what if I get stuck?

Feel free to ask for help at any time during the excerise. We work as a team, there is always someone available to help.

### do I need to use technology XYZ?

You may use any technology you are most comfortable with, the result should run a browser though

### what if I don't get all the nice to haves

don't worry these are nice to haves, the more the better but the most important goal is to have the information visible in the browser
