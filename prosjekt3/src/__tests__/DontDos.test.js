import React from 'react';
import renderer from 'react-test-renderer';
import DontDos from '../components/DontDos';
import MockAsyncStorage from '../mocks/MockAsyncStorage';


/*
 * Setter opp AsyncStorage Mock
 */
const storageCache = {};
const AsyncStorage = new MockAsyncStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);

// Task template for å putte inn i AsyncStorage
const task = (title, content, done) => {
  return {
    'title': title,
    'content': content,
    'done': done
  };
};


describe('<DontDos /> tests', () => {
  // Bygger DontDos
  const wrapper = renderer.create(<DontDos/>);
  const instance = wrapper.getInstance();

  // Test bygge snapshot
  test('<DontDos /> renders correctly', () => {
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  /*
   * Setter hva vi vil starte å ha i AsyncStorage og legger dette til i AsyncStorage
   * Dette for at vi skal ha Cards å teste
   * Gjør dette først, hvis ikke har ikke renderer noe å bygge
   */
  test('Add to AsyncStorage and test render', async () => {
    // Legger inn tasks i Async Storage
    const tasks = {};
    for (let i = 0; i < 5; i++) {
      tasks[i] = task(`Tittel ${i}`, `Content ${i}`, i % 2 === 0);
    }
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  });

  /*
   * Test createToDontCards()
   * Tester da også createNotCompletedToDontCard()
   * og createCompletedToDontCard()
   */
  test('Test: createToDontCards', async () => {
    // Må være async fordi componentDidMount er async
    // Må kalle componentDidMount for å sette state her, pga asyncstorage
    await instance.componentDidMount().then(() => {
      expect(instance.createToDontCards()).toMatchSnapshot();
    });
  });

  /*
   * Test onCheckboxPress(e)
   */
  test('Test: onCheckboxPress', async () => {
    // Endre fra done:true til done: false
    await instance.onCheckboxPress(0).then(async () => {
      // Sjekker at det er lagt i AsyncStorage
      expect(JSON.parse(await AsyncStorage.getItem('tasks'))[0].done).toBe(false);
      // Sjekker at state er forandret
      expect(instance.state.tasks[0].done).toBe(false);
    });
    // Endre fra done:false til done: true
    await instance.onCheckboxPress(1).then(async () => {
      // Sjekker at det er lagt i AsyncStorage
      expect(JSON.parse(await AsyncStorage.getItem('tasks'))[1].done).toBe(true);
      // Sjekker at state er forandret
      expect(instance.state.tasks[1].done).toBe(true);
    });
  });
});