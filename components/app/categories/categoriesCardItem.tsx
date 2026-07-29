
interface Category {
    name: string;
    icon: string;
    color: string;
}
export default function CategoriesCardItem({ category }: { category: Category}){
    return(
        <>
        <`${category.icon}`/>
        </>
    );
}