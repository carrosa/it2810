import validatorjs from 'validatorjs';
import {Form} from 'mobx-react-form';
import UserStore from '../../services/UserStore';

class BaseForm extends Form {
  plugins() {
    return {dvr: validatorjs};
  }

  setup() {
    return {
      fields: {
        username: {
          label: 'Username',
          placeholder: 'Insert Username',
          rules: 'required|string'
        },
        password: {
          label: 'Password',
          placeholder: 'Insert Password',
          rules: 'required|string'
        },
      }
    };
  }

  hooks() {
    return {
      async onSuccess(form) {
        // Get field values
        await UserStore.signAction(form.values().username, form.values().password);
      },
      onError(form) {
        // Get all form errors
        console.log('All form errors:', form.errors());
        // Invalidate the form with a custom error message
        form.invalidate('This is a generic error message!');
      }
    };
  }
}

export default new BaseForm();
