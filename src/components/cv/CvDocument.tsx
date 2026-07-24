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
  timeline: '#c4bfb8',
}

const SIDEBAR_WIDTH = 168

const styles = StyleSheet.create({
  page: {
    paddingLeft: SIDEBAR_WIDTH,
    paddingTop: 20,
    paddingBottom: 32,
    fontSize: 8,
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
  },
  sidebarContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SIDEBAR_WIDTH,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  main: {
    paddingHorizontal: 16,
  },
  brandMark: {
    width: 22,
    height: 3,
    backgroundColor: colors.accent,
    marginBottom: 10,
  },
  sideSectionTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.accentSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 9,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,107,26,0.35)',
  },
  sideBody: {
    fontSize: 6.5,
    lineHeight: 1.3,
    color: colors.sidebarMuted,
  },
  sideContact: {
    fontSize: 6.5,
    lineHeight: 1.35,
    color: colors.sidebarText,
    marginBottom: 2,
  },
  sideLabel: {
    fontSize: 6,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 1,
  },
  sideBlock: {
    marginBottom: 4,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginRight: 5,
    marginTop: 1,
  },
  langName: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.sidebarText,
  },
  langLevel: {
    fontSize: 6,
    color: colors.sidebarMuted,
  },
  interestChip: {
    fontSize: 6.5,
    color: colors.sidebarText,
    marginBottom: 2,
  },
  sideCompetencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  sideCompetencyName: {
    flex: 1,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.sidebarText,
    paddingRight: 4,
  },
  sideCompetencyLevel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.accentSoft,
  },
  headerName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  headerTagline: {
    fontSize: 7.5,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 7,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineMeta: {
    width: 72,
    paddingRight: 4,
  },
  timelineRail: {
    width: 8,
    alignItems: 'center',
  },
  timelineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
    marginTop: 1,
  },
  timelineLine: {
    width: 1,
    flexGrow: 1,
    backgroundColor: colors.timeline,
    marginTop: 1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 4,
  },
  company: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    marginBottom: 1,
  },
  dateLabel: {
    fontSize: 6,
    color: colors.muted,
    lineHeight: 1.25,
  },
  jobTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    marginBottom: 1,
  },
  jobBody: {
    fontSize: 6.5,
    lineHeight: 1.25,
    color: colors.muted,
  },
  earlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  earlyLeft: {
    flex: 1,
    fontSize: 6.5,
    color: colors.ink,
    paddingRight: 6,
  },
  earlyDate: {
    fontSize: 6,
    color: colors.muted,
  },
  qualRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  qualYear: {
    width: 28,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.accent,
  },
  qualBody: {
    flex: 1,
    fontSize: 6.5,
    color: colors.ink,
  },
})

/** Compresse une description pour tenir sur une page A4. */
function compactText(text: string, max = 110): string {
  const oneLine = text.replace(/\s+/g, ' ').trim()
  if (oneLine.length <= max) return oneLine
  return `${oneLine.slice(0, max - 1).trimEnd()}…`
}

function TimelineExperience({
  experience,
  isLast,
  compact = false,
}: {
  experience: CvExperienceItem
  isLast: boolean
  compact?: boolean
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
        {compact ? null : (
          <Text style={styles.jobBody}>{compactText(experience.description)}</Text>
        )}
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
        <View fixed style={styles.sidebar} />

        <View style={styles.sidebarContent}>
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
          <Text style={styles.sideBody}>{compactText(data.pitch, 280)}</Text>

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
                <View key={`comp-${index}`} style={styles.sideCompetencyRow}>
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
                  <Text style={styles.sideBody}>{compactText(data.rqthNote, 120)}</Text>
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
              isLast={index === recent.length - 1}
            />
          ))}

          {early.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Premières expériences</Text>
              {early.map((experience, index) => (
                <View key={`early-${index}`} style={styles.earlyRow} wrap={false}>
                  <Text style={styles.earlyLeft}>
                    {experience.title} — {experience.company}
                  </Text>
                  <Text style={styles.earlyDate}>{experience.dateLabel}</Text>
                </View>
              ))}
            </>
          ) : null}

          {data.qualifications.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Formations</Text>
              {data.qualifications.map((item, index) => (
                <View key={`qual-${index}`} style={styles.qualRow} wrap={false}>
                  <Text style={styles.qualYear}>{item.yearLabel || '—'}</Text>
                  <Text style={styles.qualBody}>
                    {item.title}
                    {item.organization ? ` — ${item.organization}` : ''}
                  </Text>
                </View>
              ))}
            </>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}
