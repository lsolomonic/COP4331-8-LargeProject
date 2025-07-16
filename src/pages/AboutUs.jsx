import { useState } from 'react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-[#2f3640] text-white p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-white-400">About Us</h1>
        <p className="text-lg text-gray-300 mb-8">
            What is it?
            Our app is a location-based vibe-sharing platform built for our COP4331 
            Large Project at the University of Central Florida. 
            Users can click on a map, assign a vibe or activity label to that spot.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          <TeamCard name="Ethan Baedorf" role="Database" />
          <TeamCard name="Bill Noel" role="API" />
          <TeamCard name="Lexi Solomonic" role="Front-end" />
          <TeamCard name="Zachary Kertesz" role="Project Manager / Mobile" />
          <TeamCard name="Joel Knopp" role="API" />
          <TeamCard name="Dev Patel" role="Front-end" />
        </div>

        <p className="text-sm text-gray-400 mt-12">
          Group 8 • COP4331 • University of Central Florida
        </p>
      </div>
    </div>
  );
}

function TeamCard({ name, role }) {
  return (
    <div className="bg-[#3b4351] p-4 rounded-2xl shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold text-blue-300 mb-1">{name}</h2>
      <p className="text-sm text-gray-300">{role}</p>
    </div>
  );
}

export default AboutUs;

