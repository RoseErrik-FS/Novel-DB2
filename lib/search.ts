import { INovel } from "@/models/novel";

export const searchNovels = async (query: string): Promise<INovel[]> => {
  // Send a GET request to the search API endpoint with the encoded query parameter
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

  // Check if the response is not OK (status code not in the range 200-299)
  if (!response.ok) {
    // Throw an error with the HTTP status code if the response is not OK
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse the response body as JSON
  const data = await response.json();

  // Return the parsed data, which is expected to be an array of INovel objects
  return data;
};