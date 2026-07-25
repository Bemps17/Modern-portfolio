import { ContactLink } from '@/components/ui/ContactLink'
import { formatCvDateTimeValue, formatCvMonthYear } from '@/lib/cv/format-date-range'
import type { CvDocumentData, CvExperienceItem } from '@/lib/cv/types'

function ExperienceItem({ experience }: { experience: CvExperienceItem }) {
  return (
    <li className="cv-experience">
      <h3 className="cv-experience__title">{experience.title}</h3>
      <p className="cv-experience__company">{experience.company}</p>
      <p className="cv-experience__dates">
        <time dateTime={formatCvDateTimeValue(experience.dateStart)}>
          {formatCvMonthYear(experience.dateStart)}
        </time>
        {' - '}
        {experience.current ? (
          <time dateTime={new Date().toISOString().slice(0, 7)}>Présent</time>
        ) : experience.dateEnd ? (
          <time dateTime={formatCvDateTimeValue(experience.dateEnd)}>
            {formatCvMonthYear(experience.dateEnd)}
          </time>
        ) : null}
      </p>
      {experience.description ? <p className="cv-experience__body">{experience.description}</p> : null}
    </li>
  )
}

/**
 * CV HTML sémantique pour ATS / partage web.
 * Flux DOM linéaire : header → contact → profil → expériences → formations → compétences…
 */
export function CvHtmlDocument({ data }: { data: CvDocumentData }) {
  const recent = data.experiences.filter((item) => !item.earlyCareer)
  const early = data.experiences.filter((item) => item.earlyCareer)
  const interestItems = data.interests
    ? data.interests
        .split(/[,·•|/]+/)
        .map((part) => part.trim())
        .filter(Boolean)
    : []

  return (
    <article className="cv-doc">
      <header className="cv-doc__header">
        <h1 className="cv-doc__name">{data.fullName}</h1>
        {data.jobTitle ? <p className="cv-doc__job-title">{data.jobTitle}</p> : null}
        <p className="cv-doc__tagline">{data.tagline}</p>
      </header>

      <main className="cv-doc__main">
        <section aria-labelledby="cv-contact" className="cv-doc__section">
          <h2 id="cv-contact">Contact</h2>
          <ul className="cv-doc__list">
            {data.location ? <li>{data.location}</li> : null}
            {data.phone ? (
              <li>
                <ContactLink size="sm" type="phone" value={data.phone} />
              </li>
            ) : null}
            <li>
              <ContactLink size="sm" type="email" value={data.email} />
            </li>
            {data.availabilityLabel ? <li>{data.availabilityLabel}</li> : null}
          </ul>
        </section>

        <section aria-labelledby="cv-profil" className="cv-doc__section">
          <h2 id="cv-profil">Profil</h2>
          <p>{data.pitch}</p>
        </section>

        <section aria-labelledby="cv-experiences" className="cv-doc__section">
          <h2 id="cv-experiences">Expériences professionnelles</h2>
          <ul className="cv-doc__experiences">
            {recent.map((experience, index) => (
              <ExperienceItem experience={experience} key={`exp-${index}`} />
            ))}
          </ul>
        </section>

        {early.length > 0 ? (
          <section aria-labelledby="cv-early" className="cv-doc__section">
            <h2 id="cv-early">Premières expériences</h2>
            <ul className="cv-doc__experiences">
              {early.map((experience, index) => (
                <ExperienceItem experience={experience} key={`early-${index}`} />
              ))}
            </ul>
          </section>
        ) : null}

        {data.qualifications.length > 0 ? (
          <section aria-labelledby="cv-formations" className="cv-doc__section">
            <h2 id="cv-formations">Formations</h2>
            <ul className="cv-doc__list">
              {data.qualifications.map((item, index) => (
                <li key={`qual-${index}`}>
                  <strong>{item.title}</strong>
                  {item.organization || item.yearLabel ? (
                    <span>
                      {' — '}
                      {[item.organization, item.yearLabel].filter(Boolean).join(', ')}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.competencies.length > 0 ? (
          <section aria-labelledby="cv-skills" className="cv-doc__section">
            <h2 id="cv-skills">Compétences</h2>
            {data.competencies.map((category, index) => (
              <div className="cv-doc__skill-group" key={`skill-${index}`}>
                <h3>{category.name}</h3>
                <ul>
                  {category.items.map((skill, skillIndex) => (
                    <li key={`skill-${index}-${skillIndex}`}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ) : null}

        {data.languages.length > 0 ? (
          <section aria-labelledby="cv-languages" className="cv-doc__section">
            <h2 id="cv-languages">Langues</h2>
            <ul className="cv-doc__list">
              {data.languages.map((lang, index) => (
                <li key={`lang-${index}`}>
                  <strong>{lang.name}</strong> — {lang.level}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.mobility || (data.showRqthOnCv && data.rqthNote) || interestItems.length > 0 ? (
          <section aria-labelledby="cv-infos" className="cv-doc__section">
            <h2 id="cv-infos">Informations complémentaires</h2>
            <ul className="cv-doc__list">
              {data.mobility ? <li>Mobilité : {data.mobility}</li> : null}
              {data.showRqthOnCv && data.rqthNote ? <li>{data.rqthNote}</li> : null}
              {interestItems.length > 0 ? <li>Centres d&apos;intérêt : {interestItems.join(', ')}</li> : null}
            </ul>
          </section>
        ) : null}
      </main>
    </article>
  )
}
