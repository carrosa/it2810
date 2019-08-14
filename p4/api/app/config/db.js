
export default {
  'secret':'my big secret',

  //VIKTIG: bytt database før kjøring av tester
  //Dette gjøres ved å bytte på komentarene

  // mlab for testing database
  //'database': 'mongodb://p4:qwer1234@ds239873.mlab.com:39873/p4-mongodb' //<--hvis dette er aktivt er vi på test db

  // VM database for bruk
  'database': 'mongodb://dev:dev@it2810-39.idi.ntnu.no:27017/p4-dev' // <-- hvis dette er aktivt fungerer appen som normalt
}
