

import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

function NotFoundPage() {
  return (
    // <div>NotFoundPage</div>
    <section className="text-center flex flex-col justify-center items-center pt-40">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
      <h1 className="text-6xl font-bold mb-4">404 Page Not Found</h1>
      <p className="text-6xl mb-4">This page does not exist</p>
    </section>
  );
}

export default NotFoundPage