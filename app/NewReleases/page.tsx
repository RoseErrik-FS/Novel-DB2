// app\NewReleases\page.tsx
import NewReleasesClient from "@/components/novels/NewReleasesClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Releases",
  description: "Check out the latest novel releases",
  keywords: "new releases, novels, books, literature",
};

const NewReleasesPage = () => {
  return <NewReleasesClient newReleases={[]} />;
};

export default NewReleasesPage;
