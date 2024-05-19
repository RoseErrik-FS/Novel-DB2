// AuthorSelect.tsx
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { OptionType } from '@/types/types';
import formStyles from '@/styles/formStyles';
import { MultiValue, ActionMeta } from 'react-select';

interface AuthorSelectProps {
  value: MultiValue<OptionType>;
  options: OptionType[];
  onChange: (value: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
  onCreateOption: (inputValue: string) => void;
}

const AuthorSelect: React.FC<AuthorSelectProps> = ({ value, options, onChange, onCreateOption }) => {
  return (
    <CreatableSelect
      isMulti
      value={value}
      options={options}
      onChange={(newValue, actionMeta) => onChange(newValue as MultiValue<OptionType>, actionMeta)}
      onCreateOption={onCreateOption}
      placeholder="Select or type to add authors"
      styles={formStyles}
    />
  );
};

export default AuthorSelect;
