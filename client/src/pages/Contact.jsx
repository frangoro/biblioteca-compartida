import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [status, setStatus] = useState('idle'); // 'idle', 'sending', 'success', 'error'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'sugerencia', // Valor por defecto
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', type: 'sugerencia', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className={`${styles.formContainer} bg-white shadow-2xl rounded-2xl overflow-hidden`}>
        <div className="bg-primary p-6 text-white text-center">
          <h2 className="text-3xl font-bold">Cuéntanos algo</h2>
          <p className="opacity-90">¿Has encontrado un error o tienes una idea para mejorar?</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label font-semibold">Nombre</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="form-label font-semibold">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label font-semibold">Tipo de mensaje</label>
            <select 
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="sugerencia">💡 Sugerencia</option>
              <option value="error">🐞 Reportar un error</option>
              <option value="otro">❓ Otro</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="form-label font-semibold">Mensaje</label>
            <textarea 
              className="form-control" 
              rows="5" 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'sending'}
            className={`w-100 btn btn-primary py-3 font-bold uppercase tracking-wider ${styles.btnSubmit}`}
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar Reporte'}
          </button>

          {status === 'success' && (
            <div className="alert alert-success mt-4">¡Mensaje enviado con éxito! Gracias por ayudarnos a mejorar.</div>
          )}
          {status === 'error' && (
            <div className="alert alert-danger mt-4">Hubo un problema. Por favor, inténtalo de nuevo más tarde.</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;