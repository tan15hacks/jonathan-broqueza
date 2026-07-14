"use client";

import { motion } from "framer-motion";
import { Facebook, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const phoneNumber = "09456821503";
const facebookUrl = "https://www.facebook.com/jonathan.broqueza.75/";

export default function ContactSkillsEnhancer() {
  const [skillPicker, setSkillPicker] = useState<HTMLElement | null>(null);
  const [contactLinks, setContactLinks] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const connectEnhancements = () => {
      setSkillPicker(document.querySelector<HTMLElement>(".skill-picker"));
      setContactLinks(document.querySelector<HTMLElement>(".contact-links"));

      const backendLine = Array.from(
        document.querySelectorAll<HTMLElement>(".toolkit-code p"),
      ).find((line) => line.textContent?.includes("backend:"));

      if (backendLine && !backendLine.textContent?.includes("Supabase")) {
        backendLine.innerHTML =
          '&nbsp;&nbsp;backend: <b>["Firebase", "Supabase", "Neon Postgres"],</b>';
      }
    };

    connectEnhancements();

    const observer = new MutationObserver(connectEnhancements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {skillPicker &&
        createPortal(
          <button
            type="button"
            className="mobile-skill-chip"
            title="Backend, authentication, database, and storage with Supabase"
          >
            Supabase
          </button>,
          skillPicker,
        )}

      {contactLinks &&
        createPortal(
          <>
            <motion.a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="magnetic-link"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.96 }}
            >
              <Facebook size={18} /> Facebook
            </motion.a>

            <motion.a
              href={`tel:${phoneNumber}`}
              className="magnetic-link"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.96 }}
            >
              <Phone size={18} /> Call me
            </motion.a>
          </>,
          contactLinks,
        )}
    </>
  );
}
