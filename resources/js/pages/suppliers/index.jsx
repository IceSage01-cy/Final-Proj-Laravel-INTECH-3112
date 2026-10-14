import NameCrud from '../../inventory/NameCrud';

export default function Index({ suppliers }) {
    return <NameCrud resource="suppliers" singular="supplier" items={suppliers} idKey="supplier_id" nameKey="supplier_name" />;
}
