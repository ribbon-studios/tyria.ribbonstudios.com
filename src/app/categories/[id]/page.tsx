export function CategoryPage({
    params,
}: CategoryPage.Props) {
  return (
    <div>Category: {params.id}</div>
  );
}

export namespace CategoryPage {
    export type Props = {
        params: { id: number; }
    };
}

export default CategoryPage;