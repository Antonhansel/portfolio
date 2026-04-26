import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"

import PortfolioLayout from "../components/portfolio-layout"
import SEO from "../components/seo"
import SelectedWork from "../components/selected-work"
import trackEvent from "../hooks/use-track-event"

const STICKY_NOTE_STYLES = [
  {
    pos: "top-left",
    style: { backgroundColor: "#fff3cd", transform: "rotate(5deg)" },
  },
  {
    pos: "top-right",
    style: { backgroundColor: "#c8e6c9", transform: "rotate(-4deg)" },
  },
  {
    pos: "bottom-left",
    style: { backgroundColor: "#ffccbc", transform: "rotate(3deg)" },
  },
  {
    pos: "bottom-right",
    style: { backgroundColor: "#fff9c4", transform: "rotate(-5deg)" },
  },
]

const STICKY_NOTES = {
  en: [
    "100M+ pages processed",
    "Top 5 App Store, 1M+ downloads",
    "Built & sold multiple SaaS",
    "20+ clients · 12\u00A0years independent",
  ],
  fr: [
    "100M+ pages traitées",
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

const ROLE_STYLES = [
  { backgroundColor: "#fce4ec" },
  { backgroundColor: "#e0f2f1" },
  { backgroundColor: "#e3f2fd" },
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
      desc: "I help SMBs and enterprises adopt AI: RAG, semantic search, LLM integrations, workflow automation — finding the right tool without overengineering. Built and sold privately.ai (Document AI SaaS).",
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
      desc: "J'accompagne PME, TPE et grands groupes dans l'adoption IA : RAG, recherche sémantique, intégrations LLM, automatisation — trouver le bon outil sans surdimensionner. J'ai aussi conçu et vendu privately.ai (SaaS Document AI).",
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
        AI systems, cloud platforms, and SaaS{" "}
        <span className="portfolio-headline-accent">
          from design to production
        </span>
        .
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
        Systèmes IA, plateformes cloud et SaaS{" "}
        <span className="portfolio-headline-accent">
          de la conception à la production
        </span>
        .
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
            {text}
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

export const Head = () => (
  <SEO
    title="Antonin Ribeaud | AI & Solutions Architect"
    description="AI systems, cloud platforms, and SaaS, from design to production. Independent since 2014."
  />
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
