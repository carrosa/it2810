import React from 'react';
import {View, AsyncStorage, ScrollView} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Checkbox,
  Caption,
  DarkTheme,
  DefaultTheme,
  Button,
  Divider
} from 'react-native-paper';
import Hr from 'react-native-hr-component';


const styles = {
  card: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  },
  caption: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20
  }
};

export default class DontDos extends React.Component {

  state = {
    tasks: {}
  };

  async componentDidMount() {
    /*
     * Henter inn antall To Don'ts
     * Henter inn alle Dont Dos og legger i state
     * Returnerer ingenting (exiter ut av funksjonen) hvis det ikke finnes noen toDonts (count < 1)
     */
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      if (tasks) { // Sjekker om det finnes noen tasks, hvis ja så setter vi task state
        this.setState({tasks: JSON.parse(tasks)});
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
        <ScrollView>
          <View>
            {
              this.createToDontCards()
            }
          </View>
        </ScrollView>
    );
  }

  async onCheckboxPress(e) {
    /*
     * Lag en ny state og sett nr i (den vi sendte inn) til motsatt verdien av det den var før
     * og så setstate med denne verdien. Dette for å oppdatere deler av state sånn at checkboxen blir checked
     */
    let newTaskState = this.state.tasks;
    newTaskState[e].done = !this.state.tasks[e].done;
    this.setState({tasks: newTaskState});
    await AsyncStorage.setItem('tasks', JSON.stringify(newTaskState));
  }

  // Hjelpemetode for å lage not completed to dont card
  createNotCompletedToDontCard(e, i) {
    return (
        <Card key={i} style={styles.card} elevation={5} theme={DefaultTheme}>
          <Card.Content>
            <Title>{this.state.tasks[e].title}</Title>
            <Paragraph>{this.state.tasks[e].content}</Paragraph>
          </Card.Content>
          <Divider/>
          <Card.Actions>
            <Button
                mode={'text'}
                onPress={() => this.onCheckboxPress(e)}
            >
              Marker som ferdig
            </Button>
          </Card.Actions>
        </Card>
    );
  }

  // Hjelpemetode for å lage completed toDontCard
  createCompletedToDontCard(e, i) {
    return (
        <Card key={'notDone' + i} style={styles.card} elevation={5} theme={DarkTheme}>
          <Card.Content>
            <Title>{this.state.tasks[e].title}</Title>
            <Paragraph>{this.state.tasks[e].content}</Paragraph>
          </Card.Content>
          <Divider/>
          <Card.Actions>
            <Button
                mode={'text'}
                onPress={() => this.onCheckboxPress(e)}
            >
              Marker som uferdig
            </Button>
          </Card.Actions>
        </Card>
    );
  }

  createToDontCards() {
    /*
     * Lager en komponent med info om det er en tom liste med tasks eller ikke
     */
    let empty = (isDoneString, key) => {
      return (
          [
            <Caption key={key} style={styles.caption}>
              Du har ingen {isDoneString} to donts
            </Caption>
          ]
      );
    };
    /*
     * Lager komponent av alle toDonts. Putter dette inn i render
     */
    let notDoneTasks = [<Hr key={'hrt'} lineColor='#000' thickness={3} fontSize={20} text='Ikke ferdig'/>];

    // Horisontal linje for å separere done og not done cards
    let doneTasks = [<Hr key={'hrb'} lineColor='#000' thickness={3} fontSize={20} text='Ferdig'/>];
    Object.keys(this.state.tasks).reverse().forEach((e, i) => { // Itererer baklengs for å få nyeste øverst
      /*
       * Sjekker om toDonten er null eller undefined just in case
       * (Det var noen som ble null da jeg lagde dette fordi jeg ikke parsa state til int når man laster
       * opp lastDontID med asyncstorage, men det er fiksa nå, så skal ikke være et problem det, men greit å ha
       * med en sjekk uansett tenker jeg. SKader ikke iallefall.
       */
      if (e !== null && e !== undefined) {
        if (!this.state.tasks[e].done) {
          notDoneTasks.push(this.createNotCompletedToDontCard(e, i));
        } else {
          doneTasks.push(this.createCompletedToDontCard(e, i));
        }
      }
    });
    return notDoneTasks.length > 1 ? notDoneTasks.concat(doneTasks.length > 1 ? doneTasks : doneTasks.concat(empty('fullførte', 'done')))
        : notDoneTasks.concat(empty('ufullførte', 'not done')).concat(doneTasks.length > 1 ? doneTasks : doneTasks.concat(empty('fullførte', 'done')));
  }
}