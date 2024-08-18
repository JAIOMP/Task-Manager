import Button from '../components/atoms/Button.vue';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    type: {
      control: { type: 'select', options: ['button', 'submit', 'reset'] },
      description: 'The type of the button element',
    },
    value: { control: 'text', description: 'The label text of the button' },
    customClass: { control: 'text', description: 'Additional custom CSS classes for the button' },
    color: {
      control: 'color',
      description: 'The color of the button (defined as a CSS variable)',
    },
  },
};

const Template = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: '<Button v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  type: 'button',
  value: 'Default Button',
  customClass: '',
};

export const SubmitButton = Template.bind({});
SubmitButton.args = {
  type: 'submit',
  value: 'Submit',
  customClass: '',
};

export const CustomButton = Template.bind({});
CustomButton.args = {
  type: 'button',
  value: 'Custom Styled Button',
  customClass: 'custom-button-class',
};

export const ResetButton = Template.bind({});
ResetButton.args = {
  type: 'reset',
  value: 'Reset',
  customClass: '',
};
