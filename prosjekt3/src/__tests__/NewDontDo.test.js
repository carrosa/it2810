import React from 'react';
import renderer from 'react-test-renderer';
import NewDontDo from '../components/NewDontDo';
import MockAsyncStorage from '../mocks/MockAsyncStorage';

/*
* Mock states vi tester med (setter state til instance med disse)
*/
const noPreviousTasksTestState = {
  title: 'Test Title',
  content: 'Test Content',
  tasks: {}
};
const multiplePreviousTasksTestState = {
  title: 'Test Title',
  content: 'Test Content',
  tasks: {
    0: {
      'title': 'previous title 1',
      'content': 'previous content 1',
      'done': false
    },
    1: {
      'title': 'previous title 1',
      'content': 'previous content 1',
      'done': false
    }
  }
};

/*
* Expected return for testen til saveNewDontDo
*/
const expectedAsyncGetTasks = {

};

/*
 * Setter opp AsyncStorage Mock
 */
const storageCache = {};
const AsyncStorage = new MockAsyncStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);



describe('<NewDontDo /> tests', () => {
  // Bygger NewDontDo
  const wrapper = renderer.create(<NewDontDo/>);
  const instance = wrapper.getInstance();

  // Test bygge et snapshot uten noe data
  test('<NewDontDo /> renders correctly', () => {
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  /*
   * Test Lage et nytt dont do object når vi ikke har noen fra før
   * Setter først statene vi skal teste for. Både med ingen previous tasks og med flere previous tasks
   */
  // Test med ingen previous tasks
  test('constructNewDontDo noPreviousState', () => {
    instance.state = noPreviousTasksTestState;
    expect(instance.constructNewDontDo()).toMatchSnapshot();
  });
  // Test med flere previous tasks
  test('constructNewDontDo multiplePreviousState', () => {
    instance.state = multiplePreviousTasksTestState;
    expect(instance.constructNewDontDo()).toMatchSnapshot();
  });

  /*
   * Test saveNewDontDo with mocked AsyncStorage
   * saveNewDontDo blir kalt med state satt i forrige test
   * Altså med state: multiplePreviousTasksTestState
   *
   * Forvented return:
   * stringified JSON av det som constructNewDontDo() spytter ut
   * den metoden er testet i forrige test, så vi vet at den funker
   *
   * Først: Test at tasks er tom
   */
  test('AsyncStorage tasks is empty', async () => {
    expect(await AsyncStorage.getItem('tasks')).toBe(null);
  });
  test('saveNewDontDo tests', async () => {
    await instance.saveNewDontDo();
    const tasks = await AsyncStorage.getItem('tasks');
    expect(tasks).toMatch(JSON.stringify(instance.constructNewDontDo()))
  });
});
