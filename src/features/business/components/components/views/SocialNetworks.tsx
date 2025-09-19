import { SocialNetworkData } from "@/features/business/types/business-form";
import { Facebook, Globe, Instagram } from "lucide-react";

interface SocialNetworksProps {
  data: SocialNetworkData;
}

export default function SocialNetworks({ data }: SocialNetworksProps) {
  const socialLinks = [
    {
      name: "Sitio web",
      url: data.websiteUrl,
      icon: <Globe />,
      hoverColor: "hover:text-blue-700",
    },
    {
      name: "Facebook",
      url: data.facebookUrl,
      icon: <Facebook />,
      hoverColor: "hover:text-blue-800",
    },
    {
      name: "Instagram",
      url: data.instagramUrl,
      icon: <Instagram />,
      hoverColor: "hover:text-pink-600",
    },
  ];

  return (
    <section aria-label="Redes sociales" className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Redes Sociales
      </h2>
      <nav className="flex items-center gap-6 text-gray-600 text-2xl">
        {socialLinks
          .filter((link) => link.url)
          .map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
              className={`transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full ${link.hoverColor}`}
            >
              {link.icon}
            </a>
          ))}
      </nav>
    </section>
  );
}
