import React from 'react';
import './index.css';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold">Our Site</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="#home" className="hover:underline">Home</a>
            </li>
            <li>
              <a href="#about" className="hover:underline">About</a>
            </li>
            <li>
              <a href="#services" className="hover:underline">Services</a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">Contact</a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="grow p-8">
        <section id="home" className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to Our Site</h2>
          <p className="text-gray-700">
            We are a company dedicated to providing the best services to our customers.
            Our mission is to deliver high-quality products that bring value to your life.
          </p>
        </section>

        <section id="about" className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="text-gray-700">
            Learn more about our journey and what drives us to be the best in the industry.
          </p>
        </section>

        <section id="services" className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-700">
            We offer a wide range of services to meet your needs, including web development,
            mobile app development, and digital marketing.
          </p>
        </section>

        <section id="contact" className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Get in touch with us to learn more about how we can help you achieve your goals.
          </p>
        </section>
      </main>

      <footer className="bg-blue-600 text-white py-4">
        <p className="text-center">&copy; 2023 Our Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
