/* Filtro personalizado para la columna de disponibilidad */
import React from 'react';
import { Form } from 'react-bootstrap';
const CategoryFilter = ({ column, books }) => {
    
    // Obtener los valores únicos dinámicamente
    const uniqueCategories = React.useMemo(() => {
        const categories = new Set(books.map(book => book.category).filter(Boolean));
        return Array.from(categories).sort();
    }, [books]); // Re-calcular solo si 'books' cambia
    
    const filterValue = column.getFilterValue();

    return (
        <Form.Group className="d-inline-flex align-items-center">
            <Form.Label className="me-2 mb-0" style={{ fontWeight: 'bold' }}>
                Categoría:
            </Form.Label>
            <Form.Select
                value={filterValue ?? 'all'}
                onChange={e => {
                    // Si 'all', elimina el filtro (undefined). Si no, establece el valor.
                    column.setFilterValue(e.target.value === 'all' ? undefined : e.target.value);
                }}
                size="sm"
            >
                <option value="all">Todas</option>
                {uniqueCategories.map(category => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default CategoryFilter;