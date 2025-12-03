/* Componente Dropdown para filtrar por Categoría con ícono */

import React from 'react';
import { Dropdown } from "react-bootstrap";
import { BiFilter } from 'react-icons/bi'; 

const IconCategoryDropdown = ({ column, books }) => {
    
    // Obtener los valores únicos dinámicamente. Usamos useMemo para optimizar el rendimiento.
    const uniqueCategories = React.useMemo(() => {
        const categories = new Set(books.map(book => book.category).filter(Boolean));
        return Array.from(categories).sort();
    }, [books]); 
    
    const filterValue = column.getFilterValue();

    // Handler que establece el valor del filtro en la columna
    const handleSelect = (category) => {
        column.setFilterValue(category === 'all' ? undefined : category);
    };

    // Etiqueta a mostrar en el botón del dropdown
    const displayLabel = uniqueCategories.includes(filterValue) 
        ? filterValue // Muestra la categoría seleccionada
        : 'Categoría';

    // Determina el estilo del botón
    const variant = filterValue ? "primary" : "outline-secondary"; 

    return (
        <Dropdown onSelect={handleSelect} className="ms-3">
            <Dropdown.Toggle 
                variant={variant} 
                id="category-filter-dropdown"
                size="sm"
            >
                <BiFilter style={{ marginRight: '5px' }} />
                {displayLabel}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {/* Opción para "Todas" (borrar el filtro) */}
                <Dropdown.Item eventKey="all">
                    <span style={{ fontWeight: filterValue === undefined ? 'bold' : 'normal' }}>
                        Todas
                    </span>
                </Dropdown.Item>
                <Dropdown.Divider />
                
                {/* Opciones de Categoría dinámica */}
                {uniqueCategories.map(category => (
                    <Dropdown.Item 
                        key={category} 
                        eventKey={category}
                    >
                        {/* Pequeño indicador visual si está seleccionado */}
                        {filterValue === category ? '✅ ' : ''}
                        {category}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
export default IconCategoryDropdown;