

import Link from 'next/link';

const FrontPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <img src="/assets/logo.png" alt="Your Image" style={{ width: '200px', height: '200px', borderRadius: '50%', marginBottom: '20px' }} />
      <h1>About Me</h1>
      <p>Your details go here...</p>
      <Link href="/">
        <a style={{ textDecoration: 'none', backgroundColor: '#0070f3', color: '#fff', padding: '10px 20px', borderRadius: '5px' }}>Back to Home</a>
      </Link>
    </div>
  );
};

export default FrontPage;
