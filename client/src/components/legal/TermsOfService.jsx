import React from 'react';

const TermsOfService = () => {
    return (
        <div className="container my-5" style={{ maxWidth: '800px' }}>
            <div className="card shadow-sm p-4 border-primary">
                <h1 className="border-bottom pb-3 mb-4 text-primary">Términos de Servicio</h1>
                <p className="text-muted">Bienvenido a la comunidad de Biblioteca Compartida.</p>

                <section className="mb-4">
                    <h2 className="h4">1. Aceptación de Términos</h2>
                    <p>Al crear una cuenta en Biblioteca Compartida, aceptas cumplir con estas normas. El objetivo es crear un entorno seguro y colaborativo para amantes de la lectura.</p>
                </section>

                <section className="mb-4">
                    <h2 className="h4">2. Responsabilidad del Usuario</h2>
                    <p>Como usuario, te comprometes a:</p>
                    <ul>
                        <li>Proporcionar información real sobre los libros que ofreces.</li>
                        <li>Mantener un trato respetuoso con los demás miembros de la comunidad.</li>
                        <li>No utilizar la plataforma para la venta de productos o spam.</li>
                    </ul>
                </section>

                <section className="mb-4">
                    <h2 className="h4">3. El Intercambio</h2>
                    <p>Biblioteca Compartida facilita la conexión entre lectores, pero no interviene en el intercambio físico. Los usuarios son responsables de acordar el lugar, la fecha y las condiciones del intercambio o préstamo.</p>
                </section>

                <section className="mb-4">
                    <h2 className="h4">4. Propiedad Intelectual</h2>
                    <p>Los usuarios conservan los derechos sobre las fotos que suban, pero otorgan a la plataforma el permiso para mostrarlas a otros usuarios con el fin de facilitar la navegación en el catálogo.</p>
                </section>

                <section className="mb-4">
                    <h2 className="h4">5. Limitación de Responsabilidad</h2>
                    <p>No nos hacemos responsables de pérdidas, daños en los libros o malentendidos entre usuarios. Actuamos únicamente como un tablón de anuncios interactivo.</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;