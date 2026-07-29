export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCategories } from "@/app/actions/categories";
import CategoriesCardItem from "./categoriesCardItem";


export default async function CategoriesCard(){
    const categories = await getCategories();

    return(
        <>
            <div className="">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                        <CategoriesCardItem
                            key={category.id}
                        />
                    ))
                ) : (
                    <div className=""></div>
                )}
            </div>
        </>
    );
}