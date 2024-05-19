// types.ts
export interface OptionType {
    value: string;
    label: string;
  }
  
  export interface NovelFormProps {
    initialData: {
      _id?: string;
      title: string;
      description: string;
      releaseDate: string;
      coverImage: string | null;
      rating: number;
      status: string;
      authors: OptionType[];
      publisher: OptionType | null;
      genres: OptionType[];
    };
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  }
  