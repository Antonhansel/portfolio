const DOMAIN_TITLES = {
  "antonin.cool": "antonin.cool",
  "antoninribeaud.fr": "antoninribeaud.fr",
}
const DEFAULT_TITLE = "antonin.cool"

const useDomainTitle = () => {
  if (typeof window !== "undefined") {
    return DOMAIN_TITLES[window.location.hostname] || DEFAULT_TITLE
  }
  return DEFAULT_TITLE
}

export default useDomainTitle
