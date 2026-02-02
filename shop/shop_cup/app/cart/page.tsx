import NavBar from '../navBar/navBar';




export default function CartPage() {
  return (
    <>
     <NavBar/>
     <div
       style={{
         height: '70vh',
         width: '90%',
         maxWidth: '1200px',
         margin: '2rem auto',
         padding: '1.5rem',
         background: '#f9fafb',
         borderRadius: '8px',
         boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
       }}
     >
       {/* Cart content goes here */}
     </div>
     </>
  );
}
// ...existing code...