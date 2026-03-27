import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-stone-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="md:w-1/2">
          <h2 className="text-5xl font-serif font-bold mb-12">Visit Us</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <MapPin className="text-orange-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Our Location</p>
                <p className="text-lg font-medium">123 Saffron Lane, Culinary District, <br /> Mumbai, Maharashtra 400001</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Phone className="text-orange-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Contact Info</p>
                <p className="text-lg font-medium">+91 98765 43210 <br /> hello@saffronspice.com</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Clock className="text-orange-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Opening Hours</p>
                <p className="text-lg font-medium">Mon - Sun: 11:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 rounded-[3rem] overflow-hidden shadow-2xl h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.803858071153!2d72.8231!3d18.9389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e850000001%3A0x8232f0ad2f767e7d!2sGateway%20Of%20India%20Mumbai!5e0!3m2!1sen!2sin!4v1710580000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            title="Restaurant Location"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
