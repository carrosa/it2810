import React from 'react';
import renderer from 'react-test-renderer';
import BaloonGame from '../components/BaloonGame';

/*
 * Må bruke fake timers pga Expo.Animated.timing
 * bruker en timer som jest ikke skjønner seg på
 * Dette fikser det
 */
jest.useFakeTimers();

// Test bygge BaloonGame snapshot
test('<BaloonGame /> renders correctly', () => {
  const tree = renderer.create(<BaloonGame/>).toJSON();
  expect(tree).toMatchSnapshot();
});

/*
* Ikke noe mer logikk å teste her
* bare å teste animasjoner og sånn
* tenker at det ikke er nødvendig
*
* Trenger heller ikke teste at TopAnimation
* redrer riktig, for det gjør den hvis rendring av BaloonGame
* ikke failer.
*/