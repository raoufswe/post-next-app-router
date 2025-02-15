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
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderProduct {
  id: string;
  price: number;
  quantity: number;
  currency: string;
  Product: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  status: "paid" | "unpaid" | "cancelled";
  User: {
    id: string;
    name: string | null;
  };
  OrderProduct: OrderProduct[];
}

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

async function getOrders(projectId: string): Promise<Order[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/orders?projectId=${projectId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const orders = await getOrders(
    (searchParams?.projectId as string) ?? "cllznpdh70000q2x6ej91bkyu"
  );

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.User.name ?? "Anonymous"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      STATUS_STYLES[order.status as keyof typeof STATUS_STYLES]
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.OrderProduct.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}{" "}
                  {order.OrderProduct[0]?.currency}
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
    </div>
  );
}
