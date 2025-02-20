import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import {
  type Order as _Order,
  type OrderProduct,
  type User,
} from "@prisma/client";
import { fetchApi } from "@/lib/fetch";
import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { EmptyState } from "@/components/dashboard/empty-state";

type Order = _Order & {
  user: User;
  orderProducts: OrderProduct[];
};

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

async function getOrders() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const response = await fetchApi<Order[]>(
    `/api/orders?projectId=${projectId}`
  );

  return response;
}

export default async function OrdersPage() {
  const response = await getOrders();

  if (!response.success) {
    return <ErrorFallback error={response.error} />;
  }

  const orders = response.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button asChild>
          <Link href="/dashboard/orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Order
          </Link>
        </Button>
      </div>

      {!orders?.length ? (
        <EmptyState
          title="No orders"
          description="Add your first order to get started."
          icon={ShoppingCart}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.user.name ?? "Anonymous"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        STATUS_STYLES[
                          order.status as keyof typeof STATUS_STYLES
                        ]
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.orderProducts.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )}{" "}
                    {order.orderProducts[0]?.currency}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/orders/${order.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
