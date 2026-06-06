import { places } from "@/data/places";
import { getPlaceGallery } from "@/data/placeGalleries";
import { notFound } from "next/navigation";
import PlaceDetailClient from "./PlaceDetailClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const place = places.find((p) => p.id === id);
  if (!place) return { title: "장소를 찾을 수 없습니다 | 방학 맵" };

  return {
    title: `${place.name} | 방학 맵`,
    description: `${place.name} - ${place.category} | ${place.address} | 운영시간: ${place.hours ?? "확인 필요"} | 입장료: ${place.fee ?? "확인 필요"}`,
    openGraph: {
      title: `${place.name} | 방학 맵`,
      description: `${place.address} | ${place.fee ?? ""}`,
      images: place.imageUrl ? [place.imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  return places.map((p) => ({ id: p.id }));
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const place = places.find((p) => p.id === id);
  if (!place) return notFound();

  const gallery = getPlaceGallery(place.id, place.category, place.imageUrl);

  // 같은 카테고리에서 최대 4개의 유사 장소 (현재 장소 제외)
  const similarPlaces = places
    .filter((p) => p.category === place.category && p.id !== place.id)
    .slice(0, 4);

  return (
    <PlaceDetailClient
      place={place}
      gallery={gallery}
      similarPlaces={similarPlaces}
    />
  );
}
