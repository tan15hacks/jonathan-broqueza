"use client";

import { motion } from "framer-motion";
import { TabletSmartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ease = [0.22, 1, 0.36, 1] as const;

export default function MobileCapabilityEnhancer() {
  const [serviceGrid, setServiceGrid] = useState<HTMLElement | null>(null);
  const [skillPicker, setSkillPicker] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findTargets = () => {
      setServiceGrid(document.querySelector<HTMLElement>(".service-grid"));
      setSkillPicker(document.querySelector<HTMLElement>(".skill-picker"));
    };

    findTargets();

    const observer = new MutationObserver(findTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {serviceGrid &&
        createPortal(
          <motion.article
            className="service-console mobile-capability-card"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.65, delay: 0.3, ease }}
            whileHover={{ y: -8 }}
          >
            <div className="console-top">
              <span>04</span>
              <i />
              <i />
            </div>
            <TabletSmartphone size={23} />
            <h3>Mobile apps</h3>
            <p>Cross-platform mobile apps built with Flutter and Dart.</p>
            <div className="console-command">build --flutter</div>
          </motion.article>,
          serviceGrid,
        )}

      {skillPicker &&
        createPortal(
          <>
            <button type="button" className="mobile-skill-chip" title="Cross-platform mobile development with Flutter">
              Flutter
            </button>
            <button type="button" className="mobile-skill-chip" title="Mobile application development with Dart">
              Dart
            </button>
            <button type="button" className="mobile-skill-chip" title="Cloud PostgreSQL database used by this portfolio">
              Neon Postgres
            </button>
          </>,
          skillPicker,
        )}
    </>
  );
}
