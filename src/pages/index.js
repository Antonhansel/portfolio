import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"

import PortfolioLayout from "../components/portfolio-layout"
import SEO from "../components/seo"
import SelectedWork from "../components/selected-work"
import trackEvent from "../hooks/use-track-event"

// Material tonal containers (blue / green / orange / purple)
const STICKY_NOTE_STYLES = [
  { pos: "top-left", style: { backgroundColor: "#d8e6ff" } },
  { pos: "top-right", style: { backgroundColor: "#d3f2da" } },
  { pos: "bottom-left", style: { backgroundColor: "#ffe3cc" } },
  { pos: "bottom-right", style: { backgroundColor: "#e9e0ff" } },
]

const TESTIMONIALS_URL =
  "https://www.linkedin.com/in/antoninribeaud/details/recommendations/?detailScreenTabIndex=0"

// LinkedIn profile photos (static/testimonials/)
const TESTI_PHOTOS = {
  "Ciprian Noaghiu": "/testimonials/ciprian.jpeg",
  "Paula Alves": "/testimonials/paula.jpeg",
  "Azeem Abu Bakar": "/testimonials/azeem.jpeg",
}

const TESTIMONIALS = {
  en: {
    title: "What clients say",
    readOn: "Read on LinkedIn",
    items: [
      {
        quote:
          "Antonin is technically solid, but above all impact-driven. He does not just do the job: he digs into the stakes behind every topic and delivers something that actually creates value. Pragmatic, reliable and structured, he moves fast without losing sight of what matters.",
        name: "Ciprian Noaghiu",
        role: "CEO, relevanC",
      },
      {
        quote:
          "Antonin stands out for his strong pedagogical skills: despite a high level of technical expertise, he is able to explain complex topics in a clear and accessible way to non-technical stakeholders.",
        name: "Paula Alves",
        role: "Head of AdOps, retail media",
      },
      {
        quote:
          "Where many before him failed, Anton succeeded, bringing about significant improvements in a short span. What sets him apart is his leadership, skill in stakeholder management, strategy, attention to detail and vision for the long haul.",
        name: "Azeem Abu Bakar",
        role: "Managing Director, FMT News",
      },
    ],
  },
  fr: {
    title: "Ce qu'en disent les clients",
    readOn: "Lire sur LinkedIn",
    items: [
      {
        quote:
          "Antonin est quelqu'un de solide techniquement, mais surtout orienté impact. Il ne se contente pas de « faire le job » : il cherche à comprendre les enjeux derrière chaque sujet et à produire quelque chose qui crée réellement de la valeur. Pragmatique, fiable et structuré, il avance vite sans perdre de vue l'essentiel.",
        name: "Ciprian Noaghiu",
        role: "CEO, relevanC",
      },
      {
        quote:
          "Antonin se distingue par ses grandes qualités pédagogiques : malgré un haut niveau d'expertise technique, il sait expliquer des sujets complexes de façon claire et accessible à des interlocuteurs non techniques.",
        name: "Paula Alves",
        role: "Head of AdOps, retail media",
      },
      {
        quote:
          "Là où beaucoup avaient échoué avant lui, Anton a réussi, avec des améliorations significatives en peu de temps. Ce qui le distingue : son leadership, sa gestion des parties prenantes, sa stratégie, son souci du détail et sa vision de long terme.",
        name: "Azeem Abu Bakar",
        role: "Managing Director, FMT News",
      },
    ],
  },
}

const STICKY_NOTES = {
  en: [
    "AI search over 100M+ pages",
    "Top 5 App Store, 1M+ downloads",
    "Built & sold multiple SaaS",
    "20+ clients · 12\u00A0years independent",
  ],
  fr: [
    "Recherche IA sur 100M+ pages",
    "Top 5 App Store, 1M+ DL",
    "Plusieurs SaaS créés et revendus",
    "20+ clients · 12\u00A0ans freelance",
  ],
}

const COMPANIES = [
  "L'Oréal",
  "Deezer",
  "Free Malaysia Today",
  "relevanC",
  "Epsor",
  "Altaïr Labs",
  "Foundingbird",
  "PokeSpot",
  "AmbientIT",
  "Kaunto",
  "Matters",
  "jolicloud",
  "Flashbreak",
  "Fullsend",
  "Vertical Ascent",
  "privately.ai",
  "EasyDCA",
]
const COMPANIES_DOUBLED = [...COMPANIES, ...COMPANIES]

// Material tonal containers, aligned with the hero stat cards
const ROLE_STYLES = [
  { backgroundColor: "#ffe3cc" },
  { backgroundColor: "#d3f2da" },
  { backgroundColor: "#d8e6ff" },
]

const ROLES = {
  en: [
    {
      title: "Technical Product Manager",
      badge: "Scrum Product Owner Certified",
      desc: "I prioritize the roadmap, scope requirements, write specs, and coordinate stakeholders. I cofounded and ran two startups (Foundingbird, Kaunto) where I owned the product end-to-end.",
    },
    {
      title: "AI for Business",
      desc: "I help SMBs and enterprises adopt AI: RAG, semantic search, LLM integrations, workflow automation, finding the right tool without overengineering. Built and sold privately.ai (Document AI SaaS).",
    },
    {
      title: "Solutions Architect",
      desc: (
        <>
          Built the ingestion pipeline for 100M+ pages at L'Oréal (OCR,
          vectorization, semantic search). Designed relevanC's analytics
          platform processing 400M+ events/month.
          <br />
          Full-stack (React, React Native, TypeScript, Python, FastAPI) on GCP
          with Terraform.
        </>
      ),
    },
  ],
  fr: [
    {
      title: "Product Manager Technique",
      badge: "Certifié Scrum Product Owner",
      desc: "Je priorise la roadmap, cadre les besoins, rédige les specs et coordonne les parties prenantes. J'ai cofondé et piloté deux startups (Foundingbird, Kaunto) où j'ai porté le produit de bout en bout.",
    },
    {
      title: "IA pour l'Entreprise",
      desc: "J'accompagne PME, TPE et grands groupes dans l'adoption IA : RAG, recherche sémantique, intégrations LLM, automatisation. Trouver le bon outil sans surdimensionner. J'ai aussi conçu et vendu privately.ai (SaaS Document AI).",
    },
    {
      title: "Architecte Solutions",
      desc: (
        <>
          J'ai dévelopé la pipeline d'ingestion de 100M+ pages chez L'Oréal
          (OCR, vectorisation, recherche sémantique). J'ai aussi construit la
          plateforme analytics de relevanC (400M+ événements/mois).
          <br />
          Full-stack (React, React Native, TypeScript, Python, FastAPI) sur GCP
          avec Terraform.
        </>
      ),
    },
  ],
}

const CONTENT = {
  en: {
    name: "Antonin Ribeaud",
    experience: "Independent since 2014",
    subtitle: <>Software Engineer · AI &amp; Solutions Architect</>,
    headline: (
      <>
        AI systems, cloud platforms, and SaaS from{" "}
        <span className="portfolio-headline-accent">design</span> to{" "}
        <span className="portfolio-headline-accent">production</span>
        <span className="portfolio-headline-accent">.</span>
      </>
    ),
    worked: "Companies I've worked with",
    resume: "Resume",
    ctaBottom: "Let's talk",
    nav: {
      blog: "blog",
      bookCall: "book a call",
      testimonials: "testimonials",
    },
  },
  fr: {
    name: "Antonin Ribeaud",
    experience: "Indépendant depuis 2014",
    subtitle: <>Développeur · IA &amp; Architecte Solutions</>,
    headline: (
      <>
        Systèmes IA, plateformes cloud et SaaS de la{" "}
        <span className="portfolio-headline-accent">conception</span> à la{" "}
        <span className="portfolio-headline-accent">production</span>
        <span className="portfolio-headline-accent">.</span>
      </>
    ),
    worked: "Entreprises avec lesquelles j'ai travaillé",
    resume: "CV",
    ctaBottom: "Discutons",
    nav: {
      blog: "blog",
      bookCall: "réserver un appel",
      testimonials: "recommandations",
    },
  },
}

const SocialLinks = ({ social, resumeLabel }) => {
  const links = [
    social?.github && (
      <a key="gh" href={social.github} onClick={() => trackEvent("click", "social", "github")}>
        GitHub
      </a>
    ),
    social?.linkedin && (
      <a key="li" href={social.linkedin} onClick={() => trackEvent("click", "social", "linkedin")}>
        LinkedIn
      </a>
    ),
    <a
      key="cv"
      href="/resume.pdf"
      download="Antonin Ribeaud - Solutions Architect & Technical Product Lead.pdf"
      onClick={() => trackEvent("download", "resume", "pdf")}
    >
      {resumeLabel}
    </a>,
  ].filter(Boolean)

  return (
    <div className="portfolio-social-links">
      {links.flatMap((link, i) =>
        i > 0
          ? [
              <span key={`d${i}`} className="portfolio-diamond">
                &#9671;
              </span>,
              link,
            ]
          : [link],
      )}
    </div>
  )
}

const IndexPage = ({ data }) => {
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social
  const avatar = data?.avatar?.childImageSharp?.gatsbyImageData
  const [lang, setLang] = useState("en")

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash === "fr" || hash === "en") {
      setLang(hash)
    } else {
      const browserLang = navigator.language || ""
      if (browserLang.startsWith("fr")) setLang("fr")
    }
  }, [])

  useEffect(() => {
    window.location.hash = lang
  }, [lang])

  const t = CONTENT[lang]
  const roles = ROLES[lang]

  return (
    <PortfolioLayout
      avatar={avatar}
      author={author}
      navLabels={t.nav}
      navExtra={
        <button
          className="lang-toggle"
          onClick={() => {
            const newLang = lang === "en" ? "fr" : "en"
            setLang(newLang)
            trackEvent("click", "language", newLang)
          }}
          aria-label="Switch language"
        >
          <img
            src={lang === "en"
              ? "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1eb-1f1f7.svg"
              : "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ec-1f1e7.svg"
            }
            alt={lang === "en" ? "FR" : "EN"}
            className="emoji-flag"
          />
        </button>
      }
    >
      <section className="portfolio-hero-wrapper">
        {STICKY_NOTES[lang].map((text, i) => (
          <div
            key={text}
            className={`sticky-note sticky-note--${STICKY_NOTE_STYLES[i].pos}`}
            style={STICKY_NOTE_STYLES[i].style}
          >
            {/* " · " marks a line break on the desktop stat cards */}
            <span>
              {text.split(" · ").map((part, j) => (
                <React.Fragment key={j}>
                  {j > 0 && <br />}
                  {part}
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
        <div className="portfolio-hero">
          <h2 className="portfolio-author-name">{t.name}</h2>
          <p className="portfolio-experience">{t.experience}</p>
          <p className="portfolio-subtitle">{t.subtitle}</p>
          <h1 className="portfolio-headline">{t.headline}</h1>
          <SocialLinks social={social} resumeLabel={t.resume} />
        </div>
      </section>

      <div className="sticky-notes-mobile">
        {STICKY_NOTES[lang].map((text, i) => (
          <div
            key={`m-${text}`}
            className="sticky-note-mobile"
            style={{
              backgroundColor: STICKY_NOTE_STYLES[i].style.backgroundColor,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      <section className="companies-section">
        <p className="companies-label">{t.worked}</p>
        <div className="companies-scroll">
          <div className="companies-track">
            {COMPANIES_DOUBLED.map((name, i) => (
              <span key={`${name}-${i}`} className="company-name">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="roles-section">
        {roles.map((role, i) => (
          <div key={role.title} className="role-card" style={ROLE_STYLES[i]}>
            <h3 className="role-card-title">{role.title}</h3>
            {role.badge && (
              <span className="role-card-badge">{role.badge}</span>
            )}
            <p className="role-card-desc">{role.desc}</p>
          </div>
        ))}
      </section>

      <section className="testi-section">
        <h2 className="testi-title">{TESTIMONIALS[lang].title}</h2>
        <div className="testi-grid">
          {TESTIMONIALS[lang].items.map(item => (
            <figure key={item.name} className="testi-card">
              <a
                className="testi-link"
                href={TESTIMONIALS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click", "social", "testimonial_linkedin")}
              >
                {TESTIMONIALS[lang].readOn} ↗
              </a>
              <blockquote className="testi-quote">{item.quote}</blockquote>
              <figcaption className="testi-who">
                <img
                  className="testi-avatar"
                  src={TESTI_PHOTOS[item.name]}
                  alt={item.name}
                  width="44"
                  height="44"
                  loading="lazy"
                />
                <div className="testi-id">
                  <span className="testi-name">{item.name}</span>
                  <span className="testi-role">{item.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <SelectedWork />

      <section className="cta-bottom">
        <a
          onClick={() => trackEvent("click", "cta", "lets_talk_bottom")}
          className="nav-pill nav-pill-primary cta-bottom-button"
          href="https://calendar.app.google/rGenB9JqgBh8xSyh8"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.ctaBottom}
        </a>
      </section>
    </PortfolioLayout>
  )
}

export default IndexPage

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Antonin Ribeaud",
  url: "https://antonin.cool",
  jobTitle: "Software Engineer, AI & Solutions Architect",
  description:
    "AI systems, cloud platforms, and SaaS, from design to production. Independent software engineer since 2014.",
  knowsAbout: [
    "Artificial Intelligence",
    "Retrieval-Augmented Generation",
    "Solutions Architecture",
    "Cloud Platforms",
    "Google Cloud Platform",
    "Terraform",
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "Product Management",
  ],
  sameAs: [
    "https://www.linkedin.com/in/antoninribeaud/",
    "https://github.com/antonhansel",
    "https://twitter.com/antoninarto",
  ],
}

export const Head = () => (
  <SEO
    title="Antonin Ribeaud | AI & Solutions Architect"
    description="AI systems, cloud platforms, and SaaS, from design to production. Independent since 2014."
  >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
    />
  </SEO>
)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        author {
          name
          summary
        }
        social {
          twitter
          linkedin
          github
        }
      }
    }
    avatar: file(absolutePath: { regex: "/profile-pic.jpeg/" }) {
      childImageSharp {
        gatsbyImageData(width: 40, height: 40, quality: 95, layout: FIXED)
      }
    }
  }
`
