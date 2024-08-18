import Input from '../components/atoms/Input.vue';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text for the input field' },
    modelValue: { control: 'text', description: 'The value of the input field' },
    id: { control: 'text', description: 'The id attribute for the input field' },
    type: {
      control: { type: 'select', options: ['text', 'email', 'password', 'number', 'date'] },
      description: 'The type of the input field',
    },
    value: { control: 'text', description: 'The initial value of the input field' },
    customClass: { control: 'text', description: 'Additional custom CSS classes for the input field' },
    required: { control: 'boolean', description: 'Whether the input field is required' },
  },
};

const Template = (args) => ({
  components: { Input },
  setup() {
    return { args };
  },
  template: '<Input v-bind="args" v-model="args.modelValue" />',
});

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter text...',
  modelValue: '',
  id: 'default-input',
  type: 'text',
  value: '',
  customClass: '',
  required: false,
};

export const DateInput = Template.bind({});
DateInput.args = {
  placeholder: 'Enter due date...',
  modelValue: '',
  id: 'date-input',
  type: 'date',
  value: '23-04-2024',
  customClass: '',
  required: true,
};

export const EmailInput = Template.bind({});
EmailInput.args = {
  placeholder: 'Enter your email...',
  modelValue: '',
  id: 'email-input',
  type: 'email',
  value: '',
  customClass: '',
  required: true,
};

export const CustomStyledInput = Template.bind({});
CustomStyledInput.args = {
  placeholder: 'Custom styled input...',
  modelValue: '',
  id: 'custom-input',
  type: 'text',
  value: '',
  customClass: 'custom-input-class',
  required: false,
};
