import { Globe, Instagram } from "lucide-react";
import { Link } from "@/components/ui/link";

export const Footer = () => {
  return (
    <footer className="mt-8 pb-4 text-sm text-gray-600 flex flex-col items-center gap-2">
      <div className="flex gap-4 items-center">
        <Link
          href="https://sonnenhof-zieger.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 flex items-center gap-1"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Website</span>
        </Link>
        <Link
          href="https://www.instagram.com/sonnenhof_zieger/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 flex items-center gap-1"
        >
          <Instagram className="h-4 w-4" />
          <span className="sr-only">Instagram</span>
        </Link>
      </div>
      <div>
        made by{" "}
        <Link
          href="https://www.linkedin.com/in/johanna-thierkopf-79560a33b/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 inline-flex items-center gap-1"
        >
          Johanna
        </Link>
        {" "}and{" "}
        <Link
          href="https://felixzieger.de"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 inline-flex items-center gap-1"
        >
          Felix
        </Link>
      </div>
    </footer>
  );
};
