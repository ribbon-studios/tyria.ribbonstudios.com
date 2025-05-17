async function CategoryPage({ params }: CategoryPage.Props) {
  const { id } = await params;

  return <div>Category: {id}</div>;
}

namespace CategoryPage {
  export type Props = {
    params: Promise<{ id: number }>;
  };
}

export default CategoryPage;
