import Link from "next/link";

// Helper Component for Social Icons
export default function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
      <Link 
        href={href} 
        className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300"
      >
        {icon}
      </Link>
    );
  }