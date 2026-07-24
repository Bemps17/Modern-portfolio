import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { CvDocumentData, CvExperienceItem } from '@/lib/cv/types'

/** Palette alignée sur le design system du site (styles.css). */
const colors = {
  sidebar: '#141418',
  sidebarText: '#f8f4ef',
  sidebarMuted: '#c4bfb8',
  accent: '#ff6b1a',
  accentSoft: '#ffc266',
  page: '#f8f4ef',
  ink: '#1a1a1a',
  muted: '#4a4a4a',
  line: '#ddd8d2',
  soft: '#efeae3',
  timeline: '#c4bfb8',
}

const SIDEBAR_WIDTH = 185

const styles = StyleSheet.create({
  page: {
    paddingLeft: SIDEBAR_WIDTH,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: colors.ink,
    backgroundColor: colors.page,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.sidebar,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  main: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 22,
  },
  brandMark: {
    width: 28,
    height: 4,
    backgroundColor: colors.accent,
    marginBottom: 14,
  },
  sideSectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.accentSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,107,26,0.35)',
  },
  sideBody: {
    fontSize: 8,
    lineHeight: 1.4,
    color: colors.sidebarMuted,
  },
  sideContact: {
    fontSize: 8,
    lineHeight: 1.45,
    color: colors.sidebarText,
    marginBottom: 3,
  },
  sideLabel: {
    fontSize: 7,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 1,
  },
  sideBlock: {
    marginBottom: 6,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
    marginTop: 2,
  },
  langName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.sidebarText,
  },
  langLevel: {
    fontSize: 7,
    color: colors.sidebarMuted,
  },
  interestChip: {
    fontSize: 7.5,
    color: colors.sidebarText,
    marginBottom: 3,
  },
  sideCompetencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  sideCompetencyName: {
    flex: 1,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.sidebarText,
    paddingRight: 6,
  },
  sideCompetencyLevel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.accentSoft,
  },
  headerName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  headerTagline: {
    fontSize: 9.5,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 7,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineMeta: {
    width: 82,
    paddingRight: 6,
  },
  timelineRail: {
    width: 10,
    alignItems: 'center',
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 2,
  },
  timelineLine: {
    width: 1.5,
    flexGrow: 1,
    backgroundColor: colors.timeline,
    marginTop: 2,
    marginBottom: 1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 5,
    paddingBottom: 2,
  },
  company: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 7,
    color: colors.muted,
    lineHeight: 1.3,
  },
  jobTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    marginBottom: 2,
  },
  jobBody: {
    fontSize: 8,
    lineHeight: 1.35,
    color: colors.muted,
  },
  quote: {
    marginTop: 2,
    padding: 8,
    backgroundColor: colors.soft,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  quoteText: {
    fontSize: 8,
    fontStyle: 'italic',
    color: colors.muted,
    lineHeight: 1.4,
  },
  quoteAuthor: {
    marginTop: 4,
    fontSize: 7.5,
    color: colors.ink,
  },
})

function TimelineExperience({
  experience,
  isLast,
}: {
  experience: CvExperienceItem
  isLast: boolean
}) {
  return (
    <View style={styles.timelineItem} wrap={false}>
      <View style={styles.timelineMeta}>
        <Text style={styles.company}>{experience.company}</Text>
        <Text style={styles.dateLabel}>{experience.dateLabel}</Text>
      </View>
      <View style={styles.timelineRail}>
        <View style={styles.timelineDot} />
        {isLast ? null : <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.jobTitle}>{experience.title}</Text>
        <Text style={styles.jobBody}>{experience.description}</Text>
      </View>
    </View>
  )
}

function splitInterests(interests: string): string[] {
  return interests
    .split(/[,·•|/]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function CvDocument({ data }: { data: CvDocumentData }) {
  const recent = data.experiences.filter((item) => !item.earlyCareer)
  const early = data.experiences.filter((item) => item.earlyCareer)
  const interestItems = data.interests ? splitInterests(data.interests) : []

  return (
    <Document author={data.fullName} subject={data.tagline} title={`CV — ${data.fullName}`}>
      <Page size="A4" style={styles.page}>
        {/* Bandeau sombre répété sur chaque page */}
        <View fixed style={styles.sidebar} />

        {/* Contenu sidebar (page 1 principalement) */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: SIDEBAR_WIDTH,
            paddingTop: 28,
            paddingBottom: 24,
            paddingHorizontal: 16,
          }}
          wrap={false}
        >
          <View style={styles.brandMark} />

          <Text style={styles.sideSectionTitle}>Contact</Text>
          {data.location ? (
            <View style={styles.sideBlock}>
              <Text style={styles.sideLabel}>Localisation</Text>
              <Text style={styles.sideContact}>{data.location}</Text>
            </View>
          ) : null}
          {data.phone ? (
            <View style={styles.sideBlock}>
              <Text style={styles.sideLabel}>Téléphone</Text>
              <Text style={styles.sideContact}>{data.phone}</Text>
            </View>
          ) : null}
          <View style={styles.sideBlock}>
            <Text style={styles.sideLabel}>Email</Text>
            <Text style={styles.sideContact}>{data.email}</Text>
          </View>
          {data.availabilityLabel ? (
            <View style={styles.sideBlock}>
              <Text style={styles.sideLabel}>Disponibilité</Text>
              <Text style={styles.sideContact}>{data.availabilityLabel}</Text>
            </View>
          ) : null}

          <Text style={styles.sideSectionTitle}>Profil</Text>
          <Text style={styles.sideBody}>{data.pitch}</Text>

          {data.languages.length > 0 ? (
            <>
              <Text style={styles.sideSectionTitle}>Langues</Text>
              {data.languages.map((lang, index) => (
                <View key={`lang-${index}`} style={styles.langRow}>
                  <View style={styles.bullet} />
                  <View>
                    <Text style={styles.langName}>{lang.name}</Text>
                    <Text style={styles.langLevel}>{lang.level}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : null}

          {data.competencies.length > 0 ? (
            <>
              <Text style={styles.sideSectionTitle}>Compétences</Text>
              {data.competencies.map((item, index) => (
                <View key={`comp-${index}`} style={styles.sideCompetencyRow} wrap={false}>
                  <Text style={styles.sideCompetencyName}>{item.name}</Text>
                  <Text style={styles.sideCompetencyLevel}>{item.level}%</Text>
                </View>
              ))}
            </>
          ) : null}

          {data.mobility || (data.showRqthOnCv && data.rqthNote) || interestItems.length > 0 ? (
            <>
              <Text style={styles.sideSectionTitle}>Infos</Text>
              {data.mobility ? (
                <View style={styles.sideBlock}>
                  <Text style={styles.sideLabel}>Mobilité</Text>
                  <Text style={styles.sideBody}>{data.mobility}</Text>
                </View>
              ) : null}
              {data.showRqthOnCv && data.rqthNote ? (
                <View style={styles.sideBlock}>
                  <Text style={styles.sideLabel}>Statut</Text>
                  <Text style={styles.sideBody}>{data.rqthNote}</Text>
                </View>
              ) : null}
              {interestItems.length > 0 ? (
                <View>
                  <Text style={styles.sideLabel}>Loisirs</Text>
                  {interestItems.map((item, index) => (
                    <Text key={`interest-${index}`} style={styles.interestChip}>
                      • {item.toUpperCase()}
                    </Text>
                  ))}
                </View>
              ) : null}
            </>
          ) : null}
        </View>

        <View style={styles.main}>
          <Text style={styles.headerName}>{data.fullName}</Text>
          <Text style={styles.headerTagline}>{data.tagline}</Text>

          <Text style={styles.sectionTitle}>Expériences professionnelles</Text>
          {recent.map((experience, index) => (
            <TimelineExperience
              key={`exp-${index}`}
              experience={experience}
              isLast={index === recent.length - 1 && early.length === 0}
            />
          ))}

          {early.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Premières expériences</Text>
              {early.map((experience, index) => (
                <TimelineExperience
                  key={`early-${index}`}
                  experience={experience}
                  isLast={index === early.length - 1}
                />
              ))}
            </>
          ) : null}

          {data.qualifications.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Formations</Text>
              {data.qualifications.map((item, index) => (
                <View key={`qual-${index}`} style={styles.timelineItem} wrap={false}>
                  <View style={styles.timelineMeta}>
                    {item.organization ? (
                      <Text style={styles.company}>{item.organization}</Text>
                    ) : null}
                    {item.yearLabel ? <Text style={styles.dateLabel}>{item.yearLabel}</Text> : null}
                  </View>
                  <View style={styles.timelineRail}>
                    <View style={styles.timelineDot} />
                    {index === data.qualifications.length - 1 ? null : (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    {item.description ? <Text style={styles.jobBody}>{item.description}</Text> : null}
                  </View>
                </View>
              ))}
            </>
          ) : null}

          {data.recommendationQuote ? (
            <>
              <Text style={styles.sectionTitle}>Recommandation</Text>
              <View style={styles.quote} wrap={false}>
                <Text style={styles.quoteText}>« {data.recommendationQuote} »</Text>
                {data.recommendationAuthor ? (
                  <Text style={styles.quoteAuthor}>— {data.recommendationAuthor}</Text>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}
