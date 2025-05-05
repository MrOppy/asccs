import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Facebook, MessageCircle, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      color: 'bg-[#1877F2] hover:bg-[#1877F2]/90',
      url: 'https://www.facebook.com/mroppy69'
    },
    {
      name: 'Messenger',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-[#00B2FF] hover:bg-[#00B2FF]/90',
      url: 'https://m.me/mroppy69'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      color: 'bg-[#E4405F] hover:bg-[#E4405F]/90',
      url: 'https://www.instagram.com/mroppy21/'
    },
    {
      name: 'WhatsApp',
      icon: <Phone className="w-6 h-6" />,
      color: 'bg-[#25D366] hover:bg-[#25D366]/90',
      url: 'https://wa.me/8801764696964'
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: 'Email',
      details: 'mroppy1@gmail.com'
    },
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      title: 'Phone',
      details: '+880 176 469 6964'
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: 'Location',
      details: 'Dhaka, Bangladesh'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="gradient-text">Contact</span> Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our accounts or need assistance with your purchase? We're here to help!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-heading font-semibold mb-6">Connect With Us</h2>
            <p className="text-muted-foreground mb-6">
              For fastest response, reach out to us on our social media channels:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white transition-colors ${link.color}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-heading font-semibold mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-muted p-2 rounded-lg mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-heading font-semibold mb-6">Business Hours</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>10:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span>11:00 AM - 11:59 PM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;