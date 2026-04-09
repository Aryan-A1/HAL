import { Leaf, Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-xl">
              <Leaf className="w-5 h-5" />
              HAL
            </div>
            <p className="mt-3 text-primary-foreground/70 text-sm leading-relaxed">
              Smart Farming, Better Tomorrow
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {["Home", "About", "Services", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary-foreground transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <p className="text-sm text-primary-foreground/70">hello@hal-agriculture.com</p>
            <p className="text-sm text-primary-foreground/70 mt-1">+1 (555) 123-4567</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"><Instagram size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 mt-12 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} HAL. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
