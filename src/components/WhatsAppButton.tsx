import { getContactSettings } from "@/app/actions/settings";

export default async function WhatsAppButton() {
  const { settings } = await getContactSettings();
  const whatsappNumber = settings?.whatsappNumber || '910000000000';

  return (
    <a 
      href={`https://wa.me/${whatsappNumber}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="whatsapp-btn"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: '#25D366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 100,
        fontSize: '2rem',
        transition: 'transform 0.2s',
        textDecoration: 'none'
      }}
    >
      💬
    </a>
  );
}
