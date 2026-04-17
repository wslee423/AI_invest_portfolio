import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansKR',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: '#111827',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: '#1D4ED8',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    paddingBottom: 4,
  },
  // 헤더 배너
  header: {
    backgroundColor: '#1D4ED8',
    borderRadius: 6,
    padding: 16,
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 9,
    color: '#BFDBFE',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 9,
    color: '#DBEAFE',
    lineHeight: 1.5,
  },
  // 자산 배분 테이블
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 5,
    paddingHorizontal: 4,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  colAsset: { width: '20%', fontWeight: 700 },
  colRatio: { width: '12%', textAlign: 'right', fontWeight: 700 },
  colDesc: { width: '68%', paddingLeft: 10, color: '#6B7280' },
  // 리스크 지표
  indicatorGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  indicatorBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  indicatorValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111827',
  },
  // 텍스트
  body: {
    lineHeight: 1.6,
    color: '#374151',
  },
  // 푸터
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
    paddingTop: 8,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 4,
  },
  footerText: {
    fontSize: 7,
    color: '#92400E',
    lineHeight: 1.5,
  },
})
