import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { CvCompetencyItem, CvDocumentData, CvExperienceItem } from '@/lib/cv/types'

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

const SIDEBAR_WIDTH = 190

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: colors.ink,
    backgroundColor: colors.page,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.sidebar,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 16,
    color: colors.sidebarText,
  },
  main: {
    flex: 1,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 24,
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
    marginTop: 16,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,107,26,0.35)',
  },
  sideBody: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: colors.sidebarMuted,
  },
  sideContact: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: colors.sidebarText,
    marginBottom: 4,
  },
  sideLabel: {
    fontSize: 7.5,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 1,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  langName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.sidebarText,
  },
  langLevel: {
    fontSize: 7.5,
    color: colors.sidebarMuted,
  },
  competencyBlock: {
    marginBottom: 8,
  },
  competencyName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.sidebarText,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  barTrack: {
    height: 3,
    backgroundColor: 'rgba(248,244,239,0.15)',
    marginBottom: 2,
  },
  barFill: {
    height: 3,
    backgroundColor: colors.accent,
  },
  competencyHint: {
    fontSize: 7,
    color: colors.sidebarMuted,
    lineHeight: 1.3,
  },
  headerName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTagline: {
    fontSize: 10,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  body: {
    fontSize: 9,
    lineHeight: 1.45,
    color: colors.ink,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineMeta: {
    width: 88,
    paddingRight: 8,
  },
  timelineRail: {
    width: 12,
    alignItems: 'center',
  },
  timelineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 2,
  },
  timelineLine: {
    width: 1.5,
    flexGrow: 1,
    backgroundColor: colors.timeline,
    marginTop: 3,
    marginBottom: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 6,
    paddingBottom: 2,
  },
  company: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 7.5,
    color: colors.muted,
    lineHeight: 1.35,
  },
  jobTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    marginBottom: 2,
  },
  jobBody: {
    fontSize: 8.5,
    lineHeight: 1.4,
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
    fontSize: 8.5,
    fontStyle: 'italic',
    color: colors.muted,
    lineHeight: 1.4,
  },
  quoteAuthor: {
    marginTop: 4,
    fontSize: 7.5,
    color: colors.ink,
  },
  interestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    fontSize: 7.5,
    color: colors.sidebarText,
    marginRight: 8,
    marginBottom: 4,
  },
})

function SidebarCompetency({ item }: { item: CvCompetencyItem }) {
  return (
    <View style={styles.competencyBlock} wrap={false}>
      <Text style={styles.competencyName}>{item.name}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${item.level}%` }]} />
      </View>
      <Text style={styles.competencyHint}>{item.description}</Text>
    </View>
  )
}

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
        <View style={styles.sidebar}>
          <View style={styles.brandMark} />

          <Text style={styles.sideSectionTitle}>Contact</Text>
          {data.location ? (
            <View style={{ marginBottom: 6 }}>
              <Text style={styles.sideLabel}>Localisation</Text>
              <Text style={styles.sideContact}>{data.location}</Text>
            </View>
          ) : null}
          {data.phone ? (
            <View style={{ marginBottom: 6 }}>
              <Text style={styles.sideLabel}>Téléphone</Text>
              <Text style={styles.sideContact}>{data.phone}</Text>
            </View>
          ) : null}
          <View style={{ marginBottom: 6 }}>
            <Text style={styles.sideLabel}>Email</Text>
            <Text style={styles.sideContact}>{data.email}</Text>
          </View>
          {data.availabilityLabel ? (
            <View style={{ marginBottom: 6 }}>
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
                <SidebarCompetency key={`comp-${index}`} item={item} />
              ))}
            </>
          ) : null}

          {data.mobility || (data.showRqthOnCv && data.rqthNote) || interestItems.length > 0 ? (
            <>
              <Text style={styles.sideSectionTitle}>Infos</Text>
              {data.mobility ? (
                <View style={{ marginBottom: 6 }}>
                  <Text style={styles.sideLabel}>Mobilité</Text>
                  <Text style={styles.sideBody}>{data.mobility}</Text>
                </View>
              ) : null}
              {data.showRqthOnCv && data.rqthNote ? (
                <View style={{ marginBottom: 6 }}>
                  <Text style={styles.sideLabel}>Statut</Text>
                  <Text style={styles.sideBody}>{data.rqthNote}</Text>
                </View>
              ) : null}
              {interestItems.length > 0 ? (
                <View>
                  <Text style={styles.sideLabel}>Centres d’intérêt</Text>
                  <View style={styles.interestRow}>
                    {interestItems.map((item, index) => (
                      <Text key={`interest-${index}`} style={styles.interestChip}>
                        • {item.toUpperCase()}
                      </Text>
                    ))}
                  </View>
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
