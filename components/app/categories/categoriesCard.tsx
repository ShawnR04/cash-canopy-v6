export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCategories } from "@/app/actions/categories";
import CategoriesCardItem from "./categoriesCardItem";

export default async function CategoriesCard() {
  const categories = await getCategories();

  // Sort categories from most recent (highest ID / newest) to least recent
  const sortedCategories =
    categories && categories.length > 0
      ? [...categories].sort((a, b) => Number(b.id) - Number(a.id))
      : [];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 no-scrollbar content-start">
        {sortedCategories.length > 0 ? (
          sortedCategories.map((category) => (
            <CategoriesCardItem key={category.id} category={category} />
          ))
        ) : (
          <div className=""></div>
        )}
      </div>
    </>
  );
}