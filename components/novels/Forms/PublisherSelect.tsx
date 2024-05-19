// PublisherSelect.tsx
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { OptionType } from '@/types/types';
import formStyles from '@/styles/formStyles';
import { SingleValue, ActionMeta } from 'react-select';

interface PublisherSelectProps {
  value: SingleValue<OptionType>;
  options: OptionType[];
  onChange: (value: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
  onCreateOption: (inputValue: string) => void;
}

const PublisherSelect: React.FC<PublisherSelectProps> = ({ value, options, onChange, onCreateOption }) => {
  return (
    <CreatableSelect
      isClearable
      value={value}
      options={options}
      onChange={(newValue, actionMeta) => onChange(newValue as unknown as SingleValue<OptionType>, actionMeta)}
      onCreateOption={onCreateOption}
      placeholder="Select or type to add publisher"
      styles={formStyles}
    />
  );
};

export default PublisherSelect;
