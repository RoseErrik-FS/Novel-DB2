// customStyles.ts
import { OptionType } from '@/types/types';
import { StylesConfig } from 'react-select';


const formStyles: StylesConfig<OptionType, true> = {
  control: (provided) => ({
    ...provided,
    color: "white",
    borderRadius: '8px',
    borderColor: '#ccc',
    backgroundColor: '#2B2A33',
    '&:hover': {
      borderColor: '#a1a1a1',
    },
    boxShadow: 'none',
    minHeight: '40px',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#0070F3',
    color: 'white',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    ':hover': {
      backgroundColor: '#005bb5',
      color: 'white',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#a1a1a1',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 5,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#0070F3' : state.isFocused ? '#e6f4ff' : 'white',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: '#e6f4ff',
      color: 'black',
    },
  }),
};

export default formStyles;
