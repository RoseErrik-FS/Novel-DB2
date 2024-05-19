// components\novels\NovelForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Spacer } from "@nextui-org/react";
import axios from "axios";
import { NovelFormProps, OptionType } from "@/types/types";
import { MultiValue, SingleValue } from "react-select";
import AuthorSelect from "./Forms/AuthorSelect";
import PublisherSelect from "./Forms/PublisherSelect";
import GenreSelect from "./Forms/GenreSelect";
import FormInput from "./Forms/FormInput";

const NovelForm: React.FC<NovelFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: initialData?._id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    releaseDate: initialData?.releaseDate || "",
    coverImage: initialData?.coverImage || "",
    rating: initialData?.rating || 0,
    status: initialData?.status || "ongoing",
    authors: initialData?.authors || ([] as MultiValue<OptionType>),
    publisher: initialData?.publisher || (null as SingleValue<OptionType>),
    genres: initialData?.genres || ([] as MultiValue<OptionType>),
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
          axios.get("/api/authors"),
          axios.get("/api/publishers"),
          axios.get("/api/genres"),
        ]);

        setAuthorOptions(
          authorsRes.data.map((author: { name: string }) => ({
            value: author.name,
            label: author.name,
          }))
        );
        setPublisherOptions(
          publishersRes.data.map((publisher: { name: string }) => ({
            value: publisher.name,
            label: publisher.name,
          }))
        );
        setGenreOptions(
          genresRes.data.map((genre: { name: string }) => ({
            value: genre.name,
            label: genre.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch options", error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (
    selectedOptions: MultiValue<OptionType> | SingleValue<OptionType>,
    name: keyof typeof formData
  ) => {
    setFormData({ ...formData, [name]: selectedOptions });
  };

  const handleCreateOption = (
    inputValue: string,
    name: keyof typeof formData
  ) => {
    const newOption = { value: inputValue, label: inputValue };
    switch (name) {
      case "authors":
        setAuthorOptions((prev) => [...prev, newOption]);
        setFormData({ ...formData, authors: [...formData.authors, newOption] });
        break;
      case "publisher":
        setPublisherOptions((prev) => [...prev, newOption]);
        setFormData({ ...formData, publisher: newOption });
        break;
      case "genres":
        setGenreOptions((prev) => [...prev, newOption]);
        setFormData({ ...formData, genres: [...formData.genres, newOption] });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Transform the form data to extract the values from the OptionType objects
    const transformedData = {
      ...formData,
      authors: formData.authors.map((author) => author.value),
      genres: formData.genres.map((genre) => genre.value),
      publisher: formData.publisher ? formData.publisher.value : null,
    };

    try {
      if (formData.id) {
        // Editing an existing novel
        await axios.put(`/api/novels/${formData.id}`, transformedData);
      } else {
        // Adding a new novel
        await axios.post("/api/novels", transformedData);
      }
      router.push("/novels");
    } catch (error) {
      console.error("Failed to save novel", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
      <FormInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <FormInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        type="textarea"
      />
      <FormInput
        label="Release Date"
        name="releaseDate"
        value={formData.releaseDate}
        onChange={handleChange}
        required
        type="date"
      />
      <FormInput
        label="Cover Image URL"
        name="coverImage"
        value={formData.coverImage}
        onChange={handleChange}
      />
      <FormInput
        label="Rating"
        name="rating"
        value={formData.rating.toString()}
        onChange={handleChange}
        required
        type="number"
        min="0"
        max="5"
      />
      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <label htmlFor="authors">Authors</label>
      <AuthorSelect
        value={formData.authors}
        options={authorOptions}
        onChange={(selectedOptions, actionMeta) =>
          handleSelectChange(selectedOptions, "authors")
        }
        onCreateOption={(inputValue) =>
          handleCreateOption(inputValue, "authors")
        }
      />
      <label htmlFor="publisher">Publisher</label>
      <PublisherSelect
        value={formData.publisher}
        options={publisherOptions}
        onChange={(selectedOptions, actionMeta) =>
          handleSelectChange(selectedOptions, "publisher")
        }
        onCreateOption={(inputValue) =>
          handleCreateOption(inputValue, "publisher")
        }
      />
      <label htmlFor="genres">Genres</label>
      <GenreSelect
        value={formData.genres}
        options={genreOptions}
        onChange={(selectedOptions, actionMeta) =>
          handleSelectChange(selectedOptions, "genres")
        }
        onCreateOption={(inputValue) =>
          handleCreateOption(inputValue, "genres")
        }
      />
      <Spacer y={1} />
      <Button type="submit">
        {formData.id ? "Update Novel" : "Add Novel"}
      </Button>
    </form>
  );
};

export default NovelForm;
