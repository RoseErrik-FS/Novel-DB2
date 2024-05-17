"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Button, Spacer } from '@nextui-org/react';
import Select, { MultiValue, SingleValue, ActionMeta, StylesConfig } from 'react-select';
import axios from 'axios';

interface OptionType {
  value: string;
  label: string;
}

const customStyles: StylesConfig<OptionType, true> = {
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

const AddNovelForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    coverImage: '',
    rating: 0,
    status: 'ongoing',
    authors: [] as OptionType[],
    publisher: null as OptionType | null,
    genres: [] as OptionType[]
  });

  const [authorOptions, setAuthorOptions] = useState<OptionType[]>([]);
  const [publisherOptions, setPublisherOptions] = useState<OptionType[]>([]);
  const [genreOptions, setGenreOptions] = useState<OptionType[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Fetch options for authors, publishers, and genres
    const fetchOptions = async () => {
      try {
        const [authorsRes, publishersRes, genresRes] = await Promise.all([
          axios.get('/api/authors'),
          axios.get('/api/publishers'),
          axios.get('/api/genres')
        ]);

        setAuthorOptions(authorsRes.data.map((author: { name: string }) => ({ value: author.name, label: author.name })));
        setPublisherOptions(publishersRes.data.map((publisher: { name: string }) => ({ value: publisher.name, label: publisher.name })));
        setGenreOptions(genresRes.data.map((genre: { name: string }) => ({ value: genre.name, label: genre.name })));
      } catch (error) {
        console.error('Failed to fetch options', error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (
    selectedOptions: MultiValue<OptionType> | SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    const { name } = actionMeta as { name: keyof typeof formData }; // Ensure name is a key of formData
    setFormData({ ...formData, [name]: selectedOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/novels', {
        ...formData,
        authors: formData.authors.map(option => option.value),
        genres: formData.genres.map(option => option.value),
        publisher: formData.publisher ? formData.publisher.value : null,
      });
      router.push('/novels'); // Redirect to novels page after successful addition
    } catch (error) {
      console.error('Failed to add novel', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
      />
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        fullWidth
      />
      <Input
        label="Release Date"
        name="releaseDate"
        type="date"
        value={formData.releaseDate}
        onChange={handleChange}
        required
        fullWidth
      />
      <Input
        label="Cover Image URL"
        name="coverImage"
        value={formData.coverImage}
        onChange={handleChange}
        fullWidth
      />
      <Input
        label="Rating"
        name="rating"
        type="number"
        min="0"
        max="5"
        value={formData.rating}
        onChange={handleChange}
        required
        fullWidth
      />
      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '8px', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <label htmlFor="authors">Authors</label>
      <Select
        id="authors"
        name="authors"
        options={authorOptions}
        isMulti
        value={formData.authors}
        onChange={handleSelectChange}
        placeholder="Select or type to add authors"
        styles={customStyles}
      />
      <label htmlFor="publisher">Publisher</label>
      <Select
        id="publisher"
        name="publisher"
        options={publisherOptions}
        value={formData.publisher}
        onChange={handleSelectChange}
        placeholder="Select or type to add publisher"
        styles={customStyles}
      />
      <label htmlFor="genres">Genres</label>
      <Select
        id="genres"
        name="genres"
        options={genreOptions}
        isMulti
        value={formData.genres}
        onChange={handleSelectChange}
        placeholder="Select or type to add genres"
        styles={customStyles}
      />
      <Spacer y={1} />
      <Button type="submit">Add Novel</Button>
    </form>
  );
};

export default AddNovelForm;
