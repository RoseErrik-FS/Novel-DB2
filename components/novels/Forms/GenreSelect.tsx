// GenreSelect.tsx
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { OptionType } from '@/types/types';
import formStyles from '@/styles/formStyles';
import { MultiValue, ActionMeta } from 'react-select';

interface GenreSelectProps {
  value: MultiValue<OptionType>;
  options: OptionType[];
  onChange: (value: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
  onCreateOption: (inputValue: string) => void;
}

const GenreSelect: React.FC<GenreSelectProps> = ({ value, options, onChange, onCreateOption }) => {
  return (
    <CreatableSelect
      isMulti
      value={value}
      options={options}
      onChange={(newValue, actionMeta) => onChange(newValue as MultiValue<OptionType>, actionMeta)}
      onCreateOption={onCreateOption}
      placeholder="Select or type to add genres"
      styles={formStyles}
    />
  );
};

export default GenreSelect;
