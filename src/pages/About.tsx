
import { Navbar } from "@/components/Navbar";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-center mb-8">About RealtyConnect</h1>
          
          <section className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              RealtyConnect is a modern real estate platform designed to simplify property discovery, communication, and transactions. Our goal is to make real estate more accessible, transparent, and user-friendly.
            </p>
          </section>
          
          <section className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Comprehensive property listings</li>
              <li>Direct messaging with property owners</li>
              <li>Detailed property information and filters</li>
              <li>Easy property publishing for sellers</li>
            </ul>
          </section>
          
          <section className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-muted-foreground">
              We are a dedicated team of real estate professionals and technology enthusiasts committed to revolutionizing the way people find and interact with properties.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
