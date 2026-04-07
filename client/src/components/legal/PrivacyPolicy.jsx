import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="container my-5" style={{ maxWidth: '800px' }}>
            <div className="card shadow-sm p-4">
                <h1 className="border-bottom pb-3 mb-4">Política de Privacidad</h1>
                <p className="text-muted">Última actualización: 7 de abril de 2026</p>

                <section className="mb-4">
                    <h2 className="h4">1. Información que recopilamos</h2>
                    <p>En <strong>Biblioteca Compartida</strong>, la privacidad de nuestros lectores es una prioridad. Recogemos los siguientes datos:</p>
                    <ul>
                        <li><strong>Datos de registro:</strong> Nombre de usuario, correo electrónico y contraseña encriptada.</li>
                        <li><strong>Perfil:</strong> Información que decidas compartir, como tu ubicación general para facilitar intercambios.</li>
                        <li><strong>Contenido:</strong> Títulos, autores e imágenes de los libros que subes a tu biblioteca.</li>
                    </ul>
                </section>

                <section className="mb-4">
                    <h2 className="h4">2. Uso de la información</h2>
                    <p>Utilizamos tus datos exclusivamente para:</p>
                    <ul>
                        <li>Gestionar tu cuenta y acceso personal.</li>
                        <li>Permitir que otros usuarios te contacten para solicitar un intercambio.</li>
                        <li>Mejorar la experiencia de usuario y seguridad de la plataforma.</li>
                    </ul>
                </section>

                <section className="mb-4">
                    <h2 className="h4">3. Seguridad</h2>
                    <p>Tus datos están protegidos mediante protocolos de seguridad modernos. Las contraseñas se almacenan de forma irreversible mediante algoritmos de hashing (bcrypt), asegurando que nadie, ni siquiera los administradores, tenga acceso a ellas.</p>
                </section>

                <section className="mb-4">
                    <h2 className="h4">4. Tus Derechos</h2>
                    <p>Tienes derecho a acceder, rectificar o eliminar tus datos en cualquier momento. Si decides darte de baja, toda tu información personal y biblioteca asociada serán eliminadas permanentemente de nuestra base de datos.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;