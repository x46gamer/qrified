import React from 'react';
import Header from './LandingPage';

const ContactUsPage = () => (
  <>
    <Header />
    <main className="container mx-auto py-16 px-4 max-w-xl">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input type="text" className="w-full border rounded px-3 py-2" placeholder="Your Name" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" placeholder="you@email.com" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Message</label>
          <textarea className="w-full border rounded px-3 py-2" rows={5} placeholder="How can we help?" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold">Send Message</button>
      </form>
    </main>
  </>
);

export default ContactUsPage; 