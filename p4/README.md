# IT1901 - Prosjekt 4 
## Imger - The Best Searchable MemeDatabase

### Installasjon 

Nettsiden i prod finnes på: http://it2810-39.idi.ntnu.no/prosjekt4/ 

Du finner endpointsene på:

/api/memes (brukes egt ikke lenger, men har ikke fjerna. Vi bruker /api/memes/search istedenfor som gjør alt av søking, sortering, etc)

/api/memes/search (kan legge på queries for å hente spesifikke sider, bare nsfw memes osv)

/api/memes/\<id\> (Henter et spesifikt meme)

/api/memes/

Resten av paths står i routes.js, men disse er get requests dere kan sjekke i browseren.

For å få kjørt testene må clone repoet. For å starte opp APIet Klienten må du kjøre npm install && npm start i både mappen /api og i /client. 

    git clone git@gitlab.stud.idi.ntnu.no:it2810-h18/prosjekt3/gruppe39.git
    cd gruppe39/client 
    npm install
    npm start
    
Deretter må API'et startes i ett nytt terminalvindu

    cd path_til_prosjektet/gruppe39/api 
    npm install
    npm start

## Frontend

For å gjøre siden enklest mulig å navigere fallt valget på å lage en "Single-Page Applications". 
for å kunne komentere og stemme må man registrere en bruker, eller logge inn med username test, password test.

### Dynamisk loading

Gruppen fikk dessverre ikke tid å implementere infinite scroll da vi møtte store problemer med CSS rammeverket. Det er mulig å trykke på knappen nederst for å laste inn flere resultater, men det var ikke dette som var planen. 

### State

<img src="https://i.imgur.com/wfrnpp8.png" height=100>

For å håndtere state valget vi å bruke [MobX](https://mobx.js.org/) i stedet for [Redux](https://redux.js.org/), etter og ha prøvd ut begge to og lest denne gode artikkelen her [Redux or MobX: An attempt to dissolve the Confusion](https://www.robinwieruch.de/redux-mobx-confusion/). Grunnen var at vi følte at vi ikke trengte ett så stort og rigid rammeverk som Redux for å håndtere staten vår, og at det ikke var behov for å ha immutable state. Videre var og syntaxen noe enklere i MobX og hele gruppen likte den objekt orienterte måten å håndtere state på.

State ble håndtert ved å lage ulike filer under ``client/src/services/``, som en importerte i de komponentene som trengte å observere state. Disse filene hadde og funksjoner for å oppdatere state. For eksempel for å hente inn Memes brukes disse to hjelpefunksjonene

    setShowMeme(id, index) {
      this.api.getMeme(id).then(res => {
        this.showMeme = {
          modal: true,
          meme: res,
          index: index
        };
        console.log(this.showMeme);
        console.log(this.showMeme.meme.media);
      }).catch(err => console.error(err));
    }

    unsetShowMeme() {
      console.log("memegone");
      this.showMeme = {
        modal: false,
        meme: null,
        index: 0
      };
    }

For at disse skal oppdateres brukes en `decorator` og ikke `@observer`, i bunnen av fila: 

    decorate(MemeStore, {
      .
      .
      .
      unsetShowMeme: action,
      setShowMeme: action,
      showMeme: observable,
      .
      .
      .
    });


### Forms

Formsene våre bruker også `mobx`, men vi bruker et bibliotek som heter `mobx-react-form` for å håndtere state her. Med dette biblioteket er det også lagt opp for validering av inputs med forskjellige javascriptbiblioteker, som f.eks. `validatorjs` som vi bruker. 

For å sette opp et form med dette gjør du følgende:
    
    import validatorjs from 'validatorjs';
    import {Form} from 'mobx-react-form';

    export default new class MyForm extends Form {
        plugins() {
            return {dvr: validatorjs} // Setter opp hvilken validator du vi ha
            // Man kan også ha flere plugins, men det har vi ikke sett behov for i dette prosjektet
        }
        setup(){ // Her er oppsettet av form fieldsene
            fields = {
                myField: {
                    label: 'myField label',
                    placeholder: 'myField placeholder',
                    rules: 'required|string' // Rules er det som skal være valideringen
                    // Man kan også legge til flere verdier her dersom man vil/trenger
                }
            }
        }
        hooks() {
            return {
                onSuccess(form) {
                    console.log(form.values());
                    // Gjør det du vil skal skje når du trykker på submit knappen i formen og felt er riktig validert
                }
                onError(form) {
                    console.log(form.errors());
                    // Gjør det du vil skal skje når du trykker submit, og ikke alle felt er riktig validert
                }
            }
        }
    }()
    
    
For å bruke denne formen gjør du følgende i en rendermetode. Hust å importere klassen du lagde istad og alt skal funke flott!
Vi kunne også brukt bare mobx for dette som vi har gjort når man kommenterer, men vi kom til at dette var en veldig oversiktelig måte å håndtere større forms.

    <form className="form">
        <label htmlFor={MyForm.$('myField').id}>
          {MyForm.$('myField').label}:&nbsp;
        </label>
        <input {...MyForm.$('myField').bind()}/>
        <p>{MyForm.$('myField').error}</p>


        <button type="submit" onClick={myForm.onSubmit}>Submit</button>
        <button onClick={MyForm.onClear}>Clear</button>
        <p>{MyForm.error}</p>
    </form>
    
    

### Components

Siden vår ble relativt minimal med følgende hovedkomponenter: *Frontpage*, *MemeModal*, og *Navnbar*. 

#### Frontpage

Dette er forsiden og den henter inn underkomponenten *Card*, samt hovedkomponentene *MemeModal* og *Navbar*. 

#### Card

Vi har laget egne cards som er tilpasset fårt bruk, fordi det var en veldig enkel og grei måte å gjøre det på.

#### MemeModal 

Her bruker vi material UI til å lage modalen. Bruk av Store for å oppdatere comments, samt poste nye comments.

#### Navbar

Bruker material UI AppBar


### Material UI

<img src="https://i.imgur.com/taH8g4w.png" height=100>

Som siste touch på nettsiden valgte gruppen å benytte seg av ett CSS rammeverk, nærmere bestemt Material UI. Dette valget ble tatt for å gi siden ett mer helhetlig preg, samt gjøre den mer brukervennlig. 

Dessverre ble denne implementasjonen noe halveis. Det største problemet var at rammeverket gjorde att nettsiden bare kjørte i Chrome/Chromium, og sannsynligvis grunnen til at det ikke var mulig å lage en "produksjonsbuild" av nettsiden. 

Av mindre problemer så ble valget om å bruke ett slikt rammeverk vedtatt sent i utviklingsprosessen. Dette gjorde at mye av utseende og CSS allerede var skrevet, noe som gjorde det tidkrevende, og til tider umulig å skrive om komponentene slik at de støttet Material UI. Sistnevnte var fordi Material UI er et relativt rigid rammeverk, som gjør det vanskelig å gjøre kosmetiske endringer på komponentene. 

Gruppen ønsket -- og prøvde -- å fjerne Material UI, men fikk ikke tid da dette innebar å skrive vår egen CSS i tillegg. 

## Backend

Backenden er en node.js, express app med mongodb som database.

Den er delt opp i 5 deler.

1. server.js
2. routes
3. controllers
4. models
5. config

### server.js

server.js er ganske standard så den bryr vi oss ikke om å forklare mer enn at den setter opp appen til å bli serva. Vi bruker bodyparser til å parse request.body, og passport.js til å håndtere authentifikasjon og authorisasjon ved bruk av json web tokens.

### Routes:

Her har vi definert alle endpointsene til apiet, hva slags requests som gjøres, og hvilke controller funksjoner som skal kjøres når man gjør en request til dette endpointet.

### Controllers:

Det er her logikken til APIet ligger. Vi har tre komponenter her:

1. AuthController

Denne tar seg av authorisering og autentifisering av brukere. Dette gjøres hendholsvis ved login og ved post requests. Når man signer inn/signer opp blir passordet hashet med bcrypt før det blir lagret i databasen. Hvis du logger inn blir hashen generert sammenlignet med den som ligger i databasen, og hvis de to er like får du tilbake en json web token. Denne bruker vi senere til å autentisere brukeren når den skal lage comments og stemme på memes. Token lagrer vi både i UserStore (mobx) og i localstorage, sånn at du ikke må logge inn på nytt hver gang du laster inn siden på nytt. Vi har satt expiration tiden til token til 12 timer, hovedsaklig fordi vi ikke vil måtte logge oss inn på nytt hele tiden. Hvis vi hadde fått bedre tid hadde vi generert en ny token en stund før den gamle "gikk ut på dato" for å holde brukeren innlogget på denne måte. Da måtte vi også brukt sessionStorage istedenfor localStorage som hadde vært en bedre løsning, men da vi fant ut av det var det allerede så dårlig tid igjen at vi ikke rakk det.

2. CommentController

Her er logikken for å gjøre actions på comments. Det er en for å lage comments, og en for å redigere comments. Den eneste vi har rukket å implementere i frontenden er den for å lage comments, så hvis du vil teste funksjonaliteten til edit-funksjonen må dette gjøres gjennom postman. For å gjøre dette setter du opp til å sende en post request (burde kanskje brukt patch her, men hindsight er 20/20). URLen du skal sende til må være: [http://localhost:8080/api/comments/<comment_id>/edit](http://localhost:8080/api/comments/<comment_id>/edit). Du må sende med en body som heter "comment" og verdien til dette en string. Du må også sende med en Authorization header med innhold som er en valid token.

3. MemeController

Her er mesteparten av koden vi bruker. Denne kontrolleren håndterer hendting av memes, og stemming på memes. Vi søker etter memes med regex hvis det er noen queries i requesten, hvis ikke henter vi bare de første. Det er lagt inn funksjonalitet for å sortere memesene med flest comments, men dette er i skrivende øyeblikk ikke implementert i frontend. Resten av sortering og søking som er implementert i apiet er riktignok implementert. Commentsdelen var mer en ettertanke som hadde vært gøy, men som vi dessverre ikke fikk tid til. Dette er igjen mulig å teste i postman med en postrequest til URL ""
[http://localhost:8080/api/memes/search?comment_count=-1](http://localhost:8080/api/memes/search?comment_count=-1)(kan også bruke `comment_count=1` for den saks skyld, for å få det sortert i motsatt rekkefølge).


### Models

Definisjonen på modellene ligger her. Vi har tre modeller: *Comment*, *Meme*, og *User*

1. *Comment*

Inneholder selve commenten, hvilken bruker som har skrevet den, som er en foreign key til et User objekt, og en created date som settes av 'pre' funksonen til Schema. Denne tar av en eller annen grunn bare imot gammel JS syntax, menemen.

2. *Meme*

Mememodellen er basert på den jsonfila vi fant med masse linker til memes. Den er ganske rett frem egt.

3. *User*

Selve skjemaet er veldig rett frem, men vi har en 'pre' funksjon her også som hasher passordet til en ny bruker før det blir lagt inn i databasen, sånn at vi aldri tar i selve passordet mer enn nødvendig. For å kunne sjekke dette passordet ved innlogging har vi laget en comparePassword funksjon som brukes ved innlogging.


### Config

Her er funksjonen for å authentisere brukeren med en token (i passport.js). Det er en implementasjon med json web token vi bruker. initialize er til for å initialisere passport ved oppstart av serveren.
db.js er bare config filen til databasen (med urien og en secret key (den er bare noe random egt.)) 


### Passport (her har vi lånt litt kode)

Store (les: nesten alt) deler av passport og authentifisering, autorisering, og brukerlaging har vi funnet på følgende side: [passport + jwt guide](https://techbrij.com/token-authentication-nodejs-express-mongo-passport). Dette er en veldig fin guide for å sette opp den samme authen som vi har gjort.




## Testing

**VIKTIG:** ikke kjør testene på databasen som burkes til å hoste applikasjonen. 
Før du kan kjøre testene er det viktig at du endrer på `db.js` i `/api/app/config`
Komenter ut linjen som brukes til å koble appen mot databasen vi bruker for applikasjonen
og koble deg på mlabb databasen vi bruker til testing. Med andre ord endre filen til.

Dette skal være gjort i denne builden fra før av, men fint om dere gidder å dobbelsjekke før testene blir kjørt.

Det hadde kanskje vært en god ide å ikke slette HELE databasen når vi tester, men bare de objektene vi lager når vi tester, menmen hindsight er 20/20....

    export default {
      'secret':'my big secret',
      // mlab database
       'database': 'mongodb://p4:qwer1234@ds239873.mlab.com:39873/p4-mongodb'

      // VM database
      //'database': 'mongodb://dev:dev@it2810-39.idi.ntnu.no:27017/p4-dev'
    };


Vi brukte cypress til å kjøre enhets tester i dette prosjektet. for å kjøre testene må du åpne cypress https://docs.cypress.io/guides/getting-started/installing-cypress.html#Opening-Cypress. derreter kan du velge den testen du vil kjøre.

Vi fant ingen "rene" måter å gjennoprette staten til databasen vår og ble derfor nødt til å finne en workaround. Det gjorde vi gjennom noen post request som ligger i api/app/clear. ved å kalle disse på starten av hver test gjennom before each funksjonen til. 

Per når jeg skriver dette failer alle testene våre på grunn av en last minute komponent som viste seg å kun virker i Chrome og ødela siden vår på alle andre nettlesere. 

Vi rakk ikke å implementere tester i jest, men valgte å pioritere å lære oss cypress, siden vi ikke hadde brukt det før. Vi skulle gjerne gjort begge, men rakk desverre ikke det. 
