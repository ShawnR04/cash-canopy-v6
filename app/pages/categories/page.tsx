import CategoriesCard from "@/components/app/categories/categoriesCard";
import CategoriesClient from "./categoriesClient";

export default function Categories(){
    return(
        <>
            <CategoriesClient>
                <CategoriesCard/>
            </CategoriesClient>
        </>
    );
}