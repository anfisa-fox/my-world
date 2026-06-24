import { getAllArtworks } from "@/lib/artworks";

export async function GET() {
  const data = getAllArtworks();

  return Response.json(data);
}
