import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { CvDocumentData } from '@/lib/cv/types'

const colors = {
  ink: '#1a1a1a',
  muted: '#4a4a4a',
  accent: '#ff6b1a',
  line: '#e5e0d8',
  soft: '#f7f4ef',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: colors.ink,
  },
  headerName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.accent,
    marginBottom: 4,
  },
  headerTagline: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 8,
  },
  contactLine: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.accent,
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.45,
    color: colors.ink,
  },
  quote: {
    marginTop: 4,
    padding: 8,
    backgroundColor: colors.soft,
    fontSize: 9,
    fontStyle: 'italic',
    color: colors.muted,
    lineHeight: 1.4,
  },
  quoteAuthor: {
    marginTop: 4,
    fontSize: 8,
    color: colors.muted,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  jobMeta: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  jobBlock: {
    marginBottom: 8,
  },
  competencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  barTrack: {
    height: 4,
    backgroundColor: colors.line,
    marginBottom: 6,
  },
  barFill: {
    height: 4,
    backgroundColor: colors.accent,
  },
  metaItem: {
    fontSize: 9,
    color: colors.ink,
    marginBottom: 3,
  },
})

export function CvDocument({ data }: { data: CvDocumentData }) {
  const recent = data.experiences.filter((item) => !item.earlyCareer)
  const early = data.experiences.filter((item) => item.earlyCareer)

  return (
    <Document
      author={data.fullName}
      title={`CV — ${data.fullName}`}
      subject={data.tagline}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerName}>{data.fullName}</Text>
        <Text style={styles.headerTagline}>{data.tagline}</Text>
        {data.location ? <Text style={styles.contactLine}>{data.location}</Text> : null}
        {data.phone ? <Text style={styles.contactLine}>{data.phone}</Text> : null}
        <Text style={styles.contactLine}>{data.email}</Text>
        {data.availabilityLabel ? (
          <Text style={styles.contactLine}>{data.availabilityLabel}</Text>
        ) : null}

        <Text style={styles.sectionTitle}>Projet professionnel</Text>
        <Text style={styles.body}>{data.pitch}</Text>

        {data.recommendationQuote ? (
          <>
            <Text style={styles.sectionTitle}>Recommandation</Text>
            <View style={styles.quote}>
              <Text>« {data.recommendationQuote} »</Text>
              {data.recommendationAuthor ? (
                <Text style={styles.quoteAuthor}>— {data.recommendationAuthor}</Text>
              ) : null}
            </View>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Expériences professionnelles</Text>
        {recent.map((experience, index) => (
          <View key={`exp-${index}`} style={styles.jobBlock} wrap={false}>
            <Text style={styles.jobTitle}>
              {experience.title} — {experience.company}
            </Text>
            <Text style={styles.jobMeta}>{experience.dateLabel}</Text>
            <Text style={styles.body}>{experience.description}</Text>
          </View>
        ))}

        {early.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Premières expériences</Text>
            {early.map((experience, index) => (
              <View key={`early-${index}`} style={styles.jobBlock} wrap={false}>
                <Text style={styles.jobTitle}>
                  {experience.title} — {experience.company}
                </Text>
                <Text style={styles.jobMeta}>{experience.dateLabel}</Text>
                <Text style={styles.body}>{experience.description}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.competencies.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Compétences clés</Text>
            {data.competencies.map((item, index) => (
              <View key={`comp-${index}`} wrap={false}>
                <View style={styles.competencyRow}>
                  <Text style={styles.jobTitle}>{item.name}</Text>
                  <Text style={styles.jobMeta}>{item.level}%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${item.level}%` }]} />
                </View>
                <Text style={[styles.body, { marginBottom: 6 }]}>{item.description}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.qualifications.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Formations</Text>
            {data.qualifications.map((item, index) => (
              <View key={`qual-${index}`} style={styles.jobBlock} wrap={false}>
                <Text style={styles.jobTitle}>
                  {item.yearLabel ? `${item.yearLabel} · ` : ''}
                  {item.title}
                  {item.organization ? ` — ${item.organization}` : ''}
                </Text>
                {item.description ? <Text style={styles.body}>{item.description}</Text> : null}
              </View>
            ))}
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Informations complémentaires</Text>
        {data.showRqthOnCv && data.rqthNote ? (
          <Text style={styles.metaItem}>Statut — {data.rqthNote}</Text>
        ) : null}
        {data.mobility ? <Text style={styles.metaItem}>Mobilité — {data.mobility}</Text> : null}
        {data.languages.length > 0 ? (
          <Text style={styles.metaItem}>
            Langues —{' '}
            {data.languages.map((lang) => `${lang.name} (${lang.level})`).join(' · ')}
          </Text>
        ) : null}
        {data.interests ? (
          <Text style={styles.metaItem}>Centres d’intérêt — {data.interests}</Text>
        ) : null}
      </Page>
    </Document>
  )
}
