import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";

import getListings, { IListingsParams } from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Await the searchParams before accessing its properties
  const params = await Promise.resolve({
    category: searchParams?.category,
    roomCount: searchParams?.roomCount ? Number(searchParams.roomCount) : undefined,
    guestCount: searchParams?.guestCount ? Number(searchParams.guestCount) : undefined,
    bathroomCount: searchParams?.bathroomCount ? Number(searchParams.bathroomCount) : undefined,
    locationValue: searchParams?.locationValue,
    startDate: searchParams?.startDate,
    endDate: searchParams?.endDate,
    userId: searchParams?.userId,
  });

  const [listings, currentUser] = await Promise.all([
    getListings(params),
    getCurrentUser()
  ]);

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div 
          className="
            pt-24
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
          "
        >
          {listings.map((listing) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}
