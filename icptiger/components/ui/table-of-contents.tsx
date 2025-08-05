"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  containerRef?: React.RefObject<HTMLElement>;
  className?: string;
}

export function TableOfContents({ containerRef, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const container = containerRef?.current || document.querySelector("article");
    if (!container) return;

    // Find all headings (h2 and h3) in the container
    const elements = Array.from(container.querySelectorAll("h2, h3"));
    
    // Process the headings
    const headingElements = elements
      .filter(element => !element.textContent?.toLowerCase().includes('table of contents'))
      .map((element) => {
        // Generate an ID if one doesn't exist
        if (!element.id) {
          const id = element.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `heading-${Math.random().toString(36).substr(2, 9)}`;
          element.id = id;
        }
        
        return {
          id: element.id,
          text: element.textContent || "",
          level: element.tagName === "H2" ? 2 : 3,
        };
      });

    setHeadings(headingElements);

    // Initialize all sections as collapsed
    const initialExpandedSections: Record<string, boolean> = {};
    headingElements.forEach(h => {
      if (h.level === 2) {
        initialExpandedSections[h.id] = false; // Start collapsed instead of expanded
      }
    });
    setExpandedSections(initialExpandedSections);

    // Set up intersection observer to highlight active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            
            // Find the current heading in our list
            const activeHeading = headingElements.find(h => h.id === entry.target.id);
            
            if (activeHeading) {
              // If it's an h2, collapse all other h2 sections and expand this one
              if (activeHeading.level === 2) {
                setExpandedSections(prev => {
                  const newState = { ...prev };
                  // Collapse all sections
                  Object.keys(newState).forEach(key => {
                    newState[key] = false;
                  });
                  // Expand only the active section
                  newState[activeHeading.id] = true;
                  return newState;
                });
              } else if (activeHeading.level === 3) {
                // If it's an h3, find its parent h2 and expand only that section
                const parentIndex = headingElements.findIndex(h => h.id === entry.target.id) - 1;
                for (let i = parentIndex; i >= 0; i--) {
                  if (headingElements[i].level === 2) {
                    setExpandedSections(prev => {
                      const newState = { ...prev };
                      // Collapse all sections
                      Object.keys(newState).forEach(key => {
                        newState[key] = false;
                      });
                      // Expand only the parent section
                      newState[headingElements[i].id] = true;
                      return newState;
                    });
                    break;
                  }
                }
              }
            }
          }
        });
      },
      { rootMargin: "-100px 0px -66%", threshold: 1.0 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [containerRef]);

  if (headings.length === 0) {
    return null;
  }

  // Organize headings into a hierarchical structure
  const organizedHeadings: { heading: Heading; children: Heading[] }[] = [];
  let currentSection: { heading: Heading; children: Heading[] } | null = null;

  headings.forEach((heading) => {
    if (heading.level === 2) {
      if (currentSection) {
        organizedHeadings.push(currentSection);
      }
      currentSection = { heading, children: [] };
    } else if (heading.level === 3 && currentSection) {
      currentSection.children.push(heading);
    }
  });

  if (currentSection) {
    organizedHeadings.push(currentSection);
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className={cn("py-4 px-4 rounded-2xl bg-[#F4F8FB] border border-[#0A66C2]/20 sticky top-24", className)}>
      <h4 className="text-lg font-bold mb-4 font-rufina text-[#0A66C2] border-b border-[#0A66C2]/30 pb-2">Table of Contents</h4>
      <nav className="space-y-3">
        {organizedHeadings.map((section) => (
          <div key={section.heading.id} className="space-y-1">
            <div className="flex items-center">
              {section.children.length > 0 && (
                <button 
                  onClick={() => toggleSection(section.heading.id)}
                  className="mr-2 focus:outline-none"
                >
                  <ChevronRight 
                    className={cn(
                      "h-3 w-3 text-[#0A66C2]/70 transition-transform",
                      expandedSections[section.heading.id] && "rotate-90"
                    )} 
                  />
                </button>
              )}
              <a
                href={`#${section.heading.id}`}
                className={cn(
                  "block py-1 text-sm font-outfit font-medium transition-colors",
                  activeId === section.heading.id ? "text-[#0A66C2]" : "text-black/70 hover:text-[#0A66C2]"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(section.heading.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {section.heading.text}
              </a>
            </div>
            
            {expandedSections[section.heading.id] && section.children.length > 0 && (
              <div className="ml-5 pl-2 border-l border-[#0A66C2]/20 space-y-1">
                {section.children.map((childHeading) => (
                  <a
                    key={childHeading.id}
                    href={`#${childHeading.id}`}
                    className={cn(
                      "block py-1 text-xs font-outfit hover:text-[#0A66C2] transition-colors",
                      activeId === childHeading.id ? "text-[#0A66C2] font-medium" : "text-black/60"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(childHeading.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {childHeading.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
} 