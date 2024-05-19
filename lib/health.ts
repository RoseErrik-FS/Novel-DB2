// lib\health.ts
export const checkApiHealth = async (
  url: string,
  retries: number,
  delay: number
): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return; // API is ready
      }
    } catch (error) {
      console.warn(
        `API health check attempt ${attempt} failed. Retrying in ${delay}ms...`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
  }
  throw new Error(`API is not ready after ${retries} attempts.`);
};
