export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCategories } from "@/app/actions/categories";
import CategoriesCardItem from "./categoriesCardItem";


export default async function CategoriesCard(){
    const categories = await getCategories();

    return(
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5 flex-1 no-scrollbar content-start">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                        <CategoriesCardItem
                            key={category.id}
                            category={category}
                        />
                    ))
                ) : (
                    <div className=""></div>
                )}
            </div>
        </>
    );
}