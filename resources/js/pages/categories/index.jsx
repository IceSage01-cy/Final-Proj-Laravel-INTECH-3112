import NameCrud from '../../inventory/NameCrud';

export default function Index({ categories }) {
    return <NameCrud resource="categories" singular="category" items={categories} idKey="category_id" nameKey="category_name" />;
}
