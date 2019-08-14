import validatorjs from 'validatorjs';
import {Form} from 'mobx-react-form';
import MemeStore from '../../services/MemeStore';

class BaseForm extends Form {
  plugins() {
    return {dvr: validatorjs};
  }

  setup() {
    return {
      fields: {
        author: {
          label: 'Author',
          placeholder: 'Author',
          rules: 'string'
        },
        title: {
          label: 'Title',
          placeholder: 'Title',
          rules: 'string'
        },
        nsfw: {
          label: 'NSFW',
          rules: 'boolean'
        },
        ups: {
          label: 'Upvotes',
          rules: 'string'
        }
      }
    };
  }

  hooks() {
    return {
      async onSuccess(form) {
        // Get field values
        console.log(form.values());
        // TODO get from api with 'query'
        MemeStore.getMemes(form.values(), true);
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
