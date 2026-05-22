import React from 'react';

export function Checkout() {
  return <div>Checkout - Redirects from service detail</div>;
}

export default function NotFound() {
  return (
    <div className="container">
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">🔴</div>
          <h3 className="empty-state-title">Page Not Found</h3>
          <p className="empty-state-text">The page you're looking for doesn't exist</p>
          <a href="/home" className="btn btn-primary">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
