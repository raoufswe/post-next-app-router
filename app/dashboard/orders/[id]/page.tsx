export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Order {params.id}</h1>
    </div>
  );
}
