export default async function OrderDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Order {params.id}</h1>
    </div>
  );
}
