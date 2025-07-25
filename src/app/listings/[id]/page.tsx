import { notFound } from "next/navigation";

interface Item {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  availableTime: string;
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 在 Server Component 里直接发 fetch（Node 环境）
  const res = await fetch(`http://localhost:4000/items/${id}`);
  if (!res.ok) {
    notFound();  // 返回 404 页面
  }
  const item: Item = await res.json();

  return (
    <div style={{ padding: 24 }}>
      <h1>{item.name}</h1>
      <img src={item.imageUrl} alt={item.name} style={{ maxWidth: 400 }} />
      <p><strong>Price:</strong> ${item.price}</p>
      <p><strong>Available Time:</strong> {new Date(item.availableTime).toLocaleString()}</p>
    </div>
  );
}