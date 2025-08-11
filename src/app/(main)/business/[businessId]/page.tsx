import BusinessProfile from "@/features/business/components/BusinessProfile";

interface Props {
  params: {
    businessId: string;
  };
}

export default async function BusinessPage({ params }: Props) {

  return (
    <div>
      <BusinessProfile businessId={params.businessId} />
      {/* Podés agregar más componentes que reciban businessId */}
    </div>
  );
}
