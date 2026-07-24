export function SeoSchema() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AP® Lab",
    "alternateName": "AP Lab",
    "url": "https://theaplab.org/",
    "description": "100% Free AP® Exam Prep, Study Guides, Video Tutorials & AI-Powered Practice Drills",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://theaplab.org/dashboard?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AP® Lab",
    "url": "https://theaplab.org/",
    "logo": "https://theaplab.org/images/logo.png",
    "sameAs": [
      "https://www.instagram.com/ap.labb/",
      "https://www.linkedin.com/company/ap-labb",
      "https://www.youtube.com/@AP_Labss",
      "https://discord.com/invite/dUSaevPETd"
    ]
  };

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AP® Lab Site Navigation",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "AP® Biology",
        "description": "Comprehensive AP® Biology units, reading articles, video lessons & practice questions",
        "url": "https://theaplab.org/dashboard/ap-biology"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "AP® Chemistry",
        "description": "Master AP® Chemistry thermodynamics, kinetics & equilibrium math",
        "url": "https://theaplab.org/dashboard/ap-chemistry"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "AP® Calculus BC",
        "description": "Limits, derivatives, integrals & coordinate proofs",
        "url": "https://theaplab.org/dashboard/ap-calculus-bc"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "AP® Physics C",
        "description": "Particle dynamics, rotation & mechanics simulations",
        "url": "https://theaplab.org/dashboard/ap-physics-c"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Lessons & Study Guides",
        "description": "Detailed reading articles and interactive vocabulary definitions",
        "url": "https://theaplab.org/dashboard"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Progress Tracker & XP Leaderboard",
        "description": "Track study hours, daily streaks, and national student rank",
        "url": "https://theaplab.org/dashboard/progress"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
    </>
  );
}
