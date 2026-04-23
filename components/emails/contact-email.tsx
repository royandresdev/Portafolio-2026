import * as React from "react";

interface ContactEmailTemplateProps {
  nombre: string;
  correo: string;
  mensaje: string;
}

export const ContactEmailTemplate: React.FC<Readonly<ContactEmailTemplateProps>> = ({
  nombre,
  correo,
  mensaje,
}) => (
  <div style={{
    fontFamily: 'DM Sans, Helvetica, Arial, sans-serif',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #1a1a1a'
  }}>
    <h1 style={{ color: '#00d1ff', fontSize: '24px', marginBottom: '24px', textTransform: 'uppercase' }}>
      Nuevo mensaje de contacto
    </h1>
    
    <div style={{ marginBottom: '20px' }}>
      <p style={{ color: '#888888', margin: '0', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Nombre</p>
      <p style={{ margin: '4px 0 0 0', fontSize: '18px' }}>{nombre}</p>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <p style={{ color: '#888888', margin: '0', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Correo</p>
      <p style={{ margin: '4px 0 0 0', fontSize: '18px' }}>
        <a href={`mailto:${correo}`} style={{ color: '#00d1ff', textDecoration: 'none' }}>{correo}</a>
      </p>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <p style={{ color: '#888888', margin: '0', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Mensaje</p>
      <p style={{ margin: '8px 0 0 0', fontSize: '16px', lineHeight: '1.6', backgroundColor: '#111111', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #00d1ff' }}>
        {mensaje}
      </p>
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid #1a1a1a', margin: '32px 0' }} />
    
    <p style={{ fontSize: '12px', color: '#555555', textAlign: 'center' }}>
      Este correo fue enviado desde tu portafolio personal.
    </p>
  </div>
);
