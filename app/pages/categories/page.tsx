export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCategories } from "@/app/actions/categories";
import CategoriesClient from "./categoriesClient";
import CategoriesCard from "@/components/app/categories/categoriesCard";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <CategoriesClient>
      <CategoriesCard categories={categories || []} />
    </CategoriesClient>
  );
}